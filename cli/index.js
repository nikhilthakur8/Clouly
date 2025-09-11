#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import os from "os";
import path from "path";
import fs from "fs";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import axios from "axios";

// Configuration
const CONFIG_DIR = path.join(os.homedir(), ".clouly");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const API_BASE_URL = "https://api.clouly.tech";

// Initialize CLI
const program = new Command();

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
	fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Initialize database
const initDb = async () => {
	const db = new Low(new JSONFile(CONFIG_FILE), { token: null, user: null });
	await db.read();
	return db;
};

let db;

// Helper functions
const getAuthToken = async () => {
	if (!db) {
		db = await initDb();
	}
	return db.data?.token;
};

const saveAuthData = async (token, user = null) => {
	if (!db) {
		db = await initDb();
	}
	db.data = { token, user };
	await db.write();
};

const makeRequest = async (
	method,
	endpoint,
	data = null,
	requireAuth = true
) => {
	try {
		const config = {
			method,
			url: `${API_BASE_URL}${endpoint}`,
			headers: {
				"Content-Type": "application/json",
			},
		};

		if (requireAuth) {
			const token = await getAuthToken();
			if (!token) {
				console.log(
					chalk.red("❌ Please login first using: clouly auth login")
				);
				process.exit(1);
			}
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (data) {
			config.data = data;
		}

		const response = await axios(config);
		return response.data;
	} catch (error) {
		if (error.response) {
			// More detailed error handling
			const errorData = error.response.data;
			if (error.response.status === 400 && errorData.issues) {
				console.log(chalk.red("❌ Validation Error:"));
				errorData.issues.forEach((issue) => {
					console.log(
						chalk.red(
							`   • ${issue.path.join(".")}: ${issue.message}`
						)
					);
				});
			} else {
				console.log(
					chalk.red(
						`❌ Error: ${
							errorData.message ||
							errorData.error ||
							"Request failed"
						}`
					)
				);
			}
		} else if (error.request) {
			console.log(
				chalk.red("❌ Network error: Unable to connect to the server")
			);
		} else {
			console.log(chalk.red(`❌ Error: ${error.message}`));
		}
		process.exit(1);
	}
};

// CLI Configuration
program
	.name("clouly")
	.description("Clouly DNS Management CLI")
	.version("1.1.0");

// Authentication Commands
const authCommand = program
	.command("auth")
	.description("Authentication commands");

authCommand
	.command("login")
	.description("Login or register to Clouly")
	.action(async () => {
		try {
			console.log(chalk.blue("🔐 Welcome to Clouly!"));

			const answers = await inquirer.prompt([
				{
					type: "input",
					name: "email",
					message: "Enter your email:",
					validate: (input) => {
						const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
						return (
							emailRegex.test(input) ||
							"Please enter a valid email address"
						);
					},
				},
				{
					type: "password",
					name: "password",
					message: "Enter your password:",
					validate: (input) => {
						return (
							input.length >= 6 ||
							"Password must be at least 6 characters"
						);
					},
				},
				{
					type: "input",
					name: "name",
					message: "Enter your name (optional):",
				},
			]);

			const userData = {
				email: answers.email.toLowerCase(),
				password: answers.password,
				role: "user",
			};

			if (answers.name) {
				userData.name = answers.name;
			}

			const response = await makeRequest(
				"POST",
				"/api/auth/login-or-register",
				userData,
				false
			);

			await saveAuthData(response.token);
			console.log(chalk.green(`✅ ${response.message}`));
			console.log(chalk.blue("🎉 You are now logged in!"));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

authCommand
	.command("logout")
	.description("Logout from Clouly")
	.action(async () => {
		await saveAuthData(null);
		console.log(chalk.green("✅ Successfully logged out"));
	});

authCommand
	.command("status")
	.description("Check authentication status")
	.action(async () => {
		const token = await getAuthToken();
		if (token) {
			console.log(chalk.green("✅ You are logged in"));
		} else {
			console.log(chalk.red("❌ You are not logged in"));
		}
	});

// Subdomain Commands
const subdomainCommand = program
	.command("subdomain")
	.alias("sub")
	.description("Subdomain management commands");

subdomainCommand
	.command("create")
	.description("Create a new subdomain")
	.action(async () => {
		try {
			const answers = await inquirer.prompt([
				{
					type: "input",
					name: "name",
					message: "Enter subdomain name:",
					validate: (input) => {
						const regex = /^[a-z0-9-]+$/;
						return (
							regex.test(input) ||
							"Subdomain name must be lowercase alphanumeric or hyphen"
						);
					},
				},
				{
					type: "input",
					name: "notes",
					message: "Notes (optional):",
				},
			]);

			const subdomainData = {
				name: answers.name.toLowerCase(),
			};

			if (answers.notes) {
				subdomainData.notes = answers.notes;
			}

			const response = await makeRequest(
				"POST",
				"/api/subdomain",
				subdomainData
			);
			console.log(chalk.green("✅ Subdomain created successfully!"));
			console.log(chalk.blue(`📝 Subdomain ID: ${response.data._id}`));
			console.log(chalk.blue(`🌐 Name: ${response.data.name}`));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

subdomainCommand
	.command("list")
	.description("List all subdomains")
	.action(async () => {
		try {
			const response = await makeRequest("GET", "/api/subdomain");

			if (response.data.length === 0) {
				console.log(chalk.yellow("📝 No subdomains found"));
				return;
			}

			console.log(chalk.blue("🌐 Your Subdomains:"));
			console.log("");

			response.data.forEach((subdomain, index) => {
				console.log(chalk.green(`${index + 1}. ${subdomain.name}`));
				console.log(chalk.gray(`   ID: ${subdomain._id}`));
				if (subdomain.notes) {
					console.log(chalk.gray(`   Notes: ${subdomain.notes}`));
				}
				console.log(
					chalk.gray(
						`   Created: ${new Date(
							subdomain.createdAt
						).toLocaleDateString()}`
					)
				);
				console.log("");
			});
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

subdomainCommand
	.command("get <subdomainId>")
	.description("Get details of a specific subdomain")
	.action(async (subdomainId) => {
		try {
			const response = await makeRequest(
				"GET",
				`/api/subdomain/${subdomainId}`
			);

			console.log(chalk.blue("🌐 Subdomain Details:"));
			console.log("");
			console.log(chalk.green(`Name: ${response.data.name}`));
			console.log(chalk.gray(`ID: ${response.data._id}`));
			if (response.data.notes) {
				console.log(chalk.gray(`Notes: ${response.data.notes}`));
			}
			console.log(
				chalk.gray(
					`Created: ${new Date(
						response.data.createdAt
					).toLocaleDateString()}`
				)
			);
			console.log(
				chalk.gray(
					`Updated: ${new Date(
						response.data.updatedAt
					).toLocaleDateString()}`
				)
			);
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

subdomainCommand
	.command("delete <subdomainId>")
	.description("Delete a subdomain")
	.action(async (subdomainId) => {
		try {
			const confirm = await inquirer.prompt([
				{
					type: "confirm",
					name: "delete",
					message: "Are you sure you want to delete this subdomain?",
					default: false,
				},
			]);

			if (!confirm.delete) {
				console.log(chalk.yellow("❌ Deletion cancelled"));
				return;
			}

			await makeRequest("DELETE", `/api/subdomain/${subdomainId}`);
			console.log(chalk.green("✅ Subdomain deleted successfully!"));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

// DNS Commands
const dnsCommand = program
	.command("dns")
	.description("DNS record management commands");

dnsCommand
	.command("create <subdomainId>")
	.description("Create a new DNS record")
	.action(async (subdomainId) => {
		try {
			const answers = await inquirer.prompt([
				{
					type: "list",
					name: "type",
					message: "Select DNS record type:",
					choices: ["A", "AAAA", "TXT", "CNAME"],
				},
				{
					type: "input",
					name: "content",
					message: "Enter record content:",
					validate: (input, answers) => {
						if (!input.trim()) return "Content is required";

						const content = input.trim();
						const type = answers?.type;

						if (type === "A") {
							const ipv4Regex =
								/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
							return (
								ipv4Regex.test(content) ||
								"A records must contain a valid IPv4 address"
							);
						}

						if (type === "AAAA") {
							const ipv6Regex =
								/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::1)|::)$/;
							return (
								ipv6Regex.test(content) ||
								"AAAA records must contain a valid IPv6 address"
							);
						}

						if (type === "CNAME") {
							const hostnameRegex =
								/^(?=.{1,253}$)([a-z0-9-]+\.)*[a-z0-9-]+$/;
							return (
								hostnameRegex.test(content) ||
								"CNAME records must contain a valid hostname"
							);
						}

						return true;
					},
				},
				{
					type: "input",
					name: "ttl",
					message: "Enter TTL (default: 3600):",
					default: "3600",
					validate: (input) => {
						const num = parseInt(input);
						return (
							(!isNaN(num) && num > 0) ||
							"TTL must be a positive number"
						);
					},
				},
				{
					type: "confirm",
					name: "proxied",
					message: "Enable proxy?",
					default: false,
					when: (answers) => {
						if (answers.type === "TXT") {
							console.log(
								chalk.yellow(
									"   ⚠️ Note: TXT records cannot be proxied"
								)
							);
							return false;
						}
						return true;
					},
				},
			]);

			const dnsData = {
				type: answers.type,
				content: answers.content.trim(),
				ttl: parseInt(answers.ttl),
				proxied:
					answers.type === "TXT" ? false : answers.proxied || false,
			};

			const response = await makeRequest(
				"POST",
				`/api/subdomain/${subdomainId}/dns`,
				dnsData
			);
			console.log(chalk.green("✅ DNS record created successfully!"));
			console.log(chalk.blue(`📝 Record ID: ${response.data._id}`));
			console.log(chalk.blue(`🔗 Type: ${response.data.type}`));
			console.log(chalk.blue(`📛 Name: ${response.data.name}`));
			console.log(chalk.blue(`📄 Content: ${response.data.content}`));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

dnsCommand
	.command("list <subdomainId>")
	.description("List all DNS records for a subdomain")
	.action(async (subdomainId) => {
		try {
			const response = await makeRequest(
				"GET",
				`/api/subdomain/${subdomainId}/dns`
			);

			if (response.data.length === 0) {
				console.log(chalk.yellow("📝 No DNS records found"));
				return;
			}

			console.log(chalk.blue("🔗 DNS Records:"));
			console.log("");

			response.data.forEach((record, index) => {
				console.log(
					chalk.green(`${index + 1}. ${record.type} - ${record.name}`)
				);
				console.log(chalk.gray(`   ID: ${record._id}`));
				console.log(chalk.gray(`   Content: ${record.content}`));
				console.log(chalk.gray(`   TTL: ${record.ttl}`));
				console.log(
					chalk.gray(`   Proxied: ${record.proxied ? "Yes" : "No"}`)
				);
				console.log("");
			});
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

dnsCommand
	.command("get <subdomainId> <dnsRecordId>")
	.description("Get details of a specific DNS record")
	.action(async (subdomainId, dnsRecordId) => {
		try {
			const response = await makeRequest(
				"GET",
				`/api/subdomain/${subdomainId}/dns/${dnsRecordId}`
			);

			console.log(chalk.blue("🔗 DNS Record Details:"));
			console.log("");
			console.log(chalk.green(`Type: ${response.data.type}`));
			console.log(chalk.gray(`ID: ${response.data._id}`));
			console.log(chalk.gray(`Name: ${response.data.name}`));
			console.log(chalk.gray(`Content: ${response.data.content}`));
			console.log(chalk.gray(`TTL: ${response.data.ttl}`));
			console.log(
				chalk.gray(`Proxied: ${response.data.proxied ? "Yes" : "No"}`)
			);
			if (response.data.priority) {
				console.log(chalk.gray(`Priority: ${response.data.priority}`));
			}
			console.log(
				chalk.gray(
					`Created: ${new Date(
						response.data.createdAt
					).toLocaleDateString()}`
				)
			);
			console.log(
				chalk.gray(
					`Updated: ${new Date(
						response.data.updatedAt
					).toLocaleDateString()}`
				)
			);
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

dnsCommand
	.command("update <subdomainId> <dnsRecordId>")
	.description("Update a DNS record")
	.action(async (subdomainId, dnsRecordId) => {
		try {
			// First get current record
			const currentRecord = await makeRequest(
				"GET",
				`/api/subdomain/${subdomainId}/dns/${dnsRecordId}`
			);

			const answers = await inquirer.prompt([
				{
					type: "list",
					name: "type",
					message: "Select DNS record type:",
					choices: ["A", "AAAA", "TXT", "CNAME"],
					default: currentRecord.data.type,
				},
				{
					type: "input",
					name: "content",
					message: "Enter record content:",
					default: currentRecord.data.content,
					validate: (input, answers) => {
						if (!input.trim()) return "Content is required";

						const content = input.trim();
						const type = answers?.type;

						if (type === "A") {
							const ipv4Regex =
								/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
							return (
								ipv4Regex.test(content) ||
								"A records must contain a valid IPv4 address"
							);
						}

						if (type === "AAAA") {
							const ipv6Regex =
								/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::1)|::)$/;
							return (
								ipv6Regex.test(content) ||
								"AAAA records must contain a valid IPv6 address"
							);
						}

						if (type === "CNAME") {
							const hostnameRegex =
								/^(?=.{1,253}$)([a-z0-9-]+\.)*[a-z0-9-]+$/;
							return (
								hostnameRegex.test(content) ||
								"CNAME records must contain a valid hostname"
							);
						}

						return true;
					},
				},
				{
					type: "input",
					name: "ttl",
					message: "Enter TTL:",
					default: currentRecord.data.ttl.toString(),
					validate: (input) => {
						const num = parseInt(input);
						return (
							(!isNaN(num) && num > 0) ||
							"TTL must be a positive number"
						);
					},
				},
				{
					type: "confirm",
					name: "proxied",
					message: "Enable proxy?",
					default: currentRecord.data.proxied,
					when: (answers) => {
						if (answers.type === "TXT") {
							console.log(
								chalk.yellow(
									"   ⚠️ Note: TXT records cannot be proxied"
								)
							);
							return false;
						}
						return true;
					},
				},
			]);

			const dnsData = {
				type: answers.type,
				content: answers.content.trim(),
				ttl: parseInt(answers.ttl),
				proxied:
					answers.type === "TXT" ? false : answers.proxied || false,
			};

			const response = await makeRequest(
				"PUT",
				`/api/subdomain/${subdomainId}/dns/${dnsRecordId}`,
				dnsData
			);
			console.log(chalk.green("✅ DNS record updated successfully!"));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

dnsCommand
	.command("delete <subdomainId> <dnsRecordId>")
	.description("Delete a DNS record")
	.action(async (subdomainId, dnsRecordId) => {
		try {
			const confirm = await inquirer.prompt([
				{
					type: "confirm",
					name: "delete",
					message: "Are you sure you want to delete this DNS record?",
					default: false,
				},
			]);

			if (!confirm.delete) {
				console.log(chalk.yellow("❌ Deletion cancelled"));
				return;
			}

			await makeRequest(
				"DELETE",
				`/api/subdomain/${subdomainId}/dns/${dnsRecordId}`
			);
			console.log(chalk.green("✅ DNS record deleted successfully!"));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

// Status command
program
	.command("status")
	.description("Check API status")
	.action(async () => {
		try {
			const response = await makeRequest("GET", "/status", null, false);
			console.log(chalk.green("✅ API is running"));
			console.log(chalk.blue(`📡 Response: ${response}`));
		} catch (error) {
			// Error is already handled in makeRequest
		}
	});

// Help command
program
	.command("help")
	.description("Show help information")
	.action(() => {
		console.log(chalk.blue("🌐 Clouly DNS Management CLI"));
		console.log("");
		console.log(chalk.green("Authentication:"));
		console.log("  clouly auth login          Login or register");
		console.log("  clouly auth logout         Logout");
		console.log("  clouly auth status         Check login status");
		console.log("");
		console.log(chalk.green("Subdomain Management:"));
		console.log("  clouly subdomain create    Create a new subdomain");
		console.log("  clouly subdomain list      List all subdomains");
		console.log("  clouly subdomain get <id>  Get subdomain details");
		console.log("  clouly subdomain delete <id>  Delete a subdomain");
		console.log("");
		console.log(chalk.green("DNS Record Management:"));
		console.log("  clouly dns create <subId>      Create DNS record");
		console.log("  clouly dns list <subId>        List DNS records");
		console.log("  clouly dns get <subId> <id>    Get DNS record details");
		console.log("  clouly dns update <subId> <id> Update DNS record");
		console.log("  clouly dns delete <subId> <id> Delete DNS record");
		console.log("");
		console.log(chalk.green("Other:"));
		console.log("  clouly status              Check API status");
		console.log("  clouly help                Show this help");
	});

program.parse(process.argv);
