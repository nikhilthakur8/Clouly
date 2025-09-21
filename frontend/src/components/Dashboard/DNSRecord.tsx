import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
	Globe,
	Loader2,
	Trash2,
	Edit,
	Plus,
	ArrowLeft,
	Clock,
	Copy,
	CopyCheck,
} from "lucide-react";

type DNSRecordFormData = {
	type: "A" | "AAAA" | "TXT" | "CNAME";
	content: string;
	ttl: number;
};

type DNSRecord = {
	_id: string;
	type: string;
	content: string;
	ttl: number;
	name: string;
	createdAt: string;
	updatedAt: string;
};

type Subdomain = {
	_id: string;
	name: string;
	notes?: string;
};

export const DNSRecord = () => {
	const { subdomainId } = useParams<{ subdomainId: string }>();
	const navigate = useNavigate();

	const [copied, setCopied] = useState<boolean>(false);
	const [subdomain, setSubdomain] = useState<Subdomain | null>(null);
	const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);

	const ttlOptions = [
		{ value: "3600", label: "3600 - 1 hour" },
		{ value: "7200", label: "7200 - 2 hours" },
		{ value: "14400", label: "14400 - 4 hours" },
		{ value: "28800", label: "28800 - 8 hours" },
		{ value: "43200", label: "43200 - 12 hours" },
		{ value: "86400", label: "86400 - 24 hours" },
	];

	const recordTypes = [
		{ value: "A", label: "A - IPv4 Address" },
		{ value: "AAAA", label: "AAAA - IPv6 Address" },
		{ value: "CNAME", label: "CNAME - Canonical Name" },
		{ value: "TXT", label: "TXT - Text Record" },
	];

	useEffect(() => {
		if (!subdomainId) return;

		const fetchData = async () => {
			try {
				setLoading(true);

				const subdomainResponse = await api.get(
					`subdomain/${subdomainId}`
				);
				setSubdomain(subdomainResponse.data.data);

				const dnsResponse = await api.get(
					`subdomain/${subdomainId}/dns`
				);
				setDnsRecords(dnsResponse.data.data || []);

				document.title = `DNS Records - ${subdomainResponse.data.data.name}.clouly.in`;
			} catch (err) {
				console.error(err);
				toast.error("Failed to load DNS records");
				navigate("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [subdomainId, navigate]);

	const form = useForm<DNSRecordFormData>({
		defaultValues: {
			type: "A",
			content: "",
			ttl: 3600,
		},
	});

	const handleCreateOrUpdate = async (values: DNSRecordFormData) => {
		try {
			setSaving(true);

			if (editingRecord) {
				const response = await api.put(
					`subdomain/${subdomainId}/dns/${editingRecord._id}`,
					values
				);
				setDnsRecords((prev) =>
					prev.map((record) =>
						record._id === editingRecord._id
							? response.data.data
							: record
					)
				);
				toast.success("DNS record updated successfully");
			} else {
				const response = await api.post(
					`subdomain/${subdomainId}/dns`,
					values
				);
				setDnsRecords((prev) => [response.data.data, ...prev]);
				toast.success("DNS record created successfully");
			}

			form.reset();
			setOpen(false);
			setEditingRecord(null);
		} catch (err: unknown) {
			console.error(err);
			const errorMessage =
				err && typeof err === "object" && "response" in err
					? (err as { response?: { data?: { message?: string } } })
							.response?.data?.message
					: `Failed to ${
							editingRecord ? "update" : "create"
					  } DNS record`;
			toast.error(errorMessage);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (recordId: string) => {
		try {
			await api.delete(`subdomain/${subdomainId}/dns/${recordId}`);
			setDnsRecords((prev) =>
				prev.filter((record) => record._id !== recordId)
			);
			toast.success("DNS record deleted successfully");
		} catch (err: unknown) {
			console.error(err);
			toast.error("Failed to delete DNS record");
		}
	};

	const openEditDialog = (record: DNSRecord) => {
		setEditingRecord(record);
		form.reset({
			type: record.type as "A" | "AAAA" | "TXT" | "CNAME",
			content: record.content,
			ttl: record.ttl,
		});
		setOpen(true);
	};

	const openCreateDialog = () => {
		setEditingRecord(null);
		form.reset({ type: "A", content: "", ttl: 3600 });
		setOpen(true);
	};

	const getPlaceholder = (type: string) => {
		switch (type) {
			case "A":
				return "192.168.1.1";
			case "AAAA":
				return "2001:db8::1";
			case "CNAME":
				return "example.com";
			case "TXT":
				return "Text content";
			default:
				return "";
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="ml-2 text-sm text-muted-foreground">
					Loading DNS records...
				</p>
			</div>
		);
	}
	const handleCopy = () => {
		if (subdomain?.name) {
			navigator.clipboard.writeText(`${subdomain.name}.clouly.in`);
			setCopied(true);
			toast.info(`Copied ${subdomain.name}.clouly.in to clipboard`);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	const filteredRecords = dnsRecords.filter(
		(record) =>
			record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-4">
					<ArrowLeft
						className="h-6 w-6 cursor-pointer"
						onClick={() => navigate("/dashboard")}
					/>
					<div>
						<h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							DNS Records
						</h1>
						<div
							className="flex items-center gap-2 cursor-pointer mt-1"
							onClick={handleCopy}
						>
							<p className="text-sm md:text-base  text-muted-foreground">
								{subdomain?.name}.clouly.in
							</p>
							{copied ? (
								<>
									<CopyCheck className="h-4 w-4" />
								</>
							) : (
								<Copy className="h-4 w-4" />
							)}
						</div>
					</div>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={openCreateDialog}
							className="text-base"
						>
							<Plus className="h-4 w-4" />
							Add DNS Record
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-lg">
								{editingRecord
									? "Edit DNS Record"
									: "Add DNS Record"}
							</DialogTitle>
						</DialogHeader>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(
									handleCreateOrUpdate
								)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												Record Type
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="text-base">
														<SelectValue placeholder="Select record type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{recordTypes.map((type) => (
														<SelectItem
															key={type.value}
															value={type.value}
															className="text-base"
														>
															{type.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="content"
									rules={{
										required: "Content is required",
										minLength: {
											value: 1,
											message: "Content cannot be empty",
										},
										validate: (value) => {
											const type = form.getValues("type");
											const ipv4Regex =
												/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
											const ipv6Regex =
												/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::1)|::)$/;
											const hostnameRegex =
												/^(?=.{1,253}$)([a-z0-9-]+\.)*[a-z0-9-]+$/;

											if (
												type === "A" &&
												!ipv4Regex.test(value)
											) {
												return "Content must be a valid IPv4 address";
											}
											if (
												type === "AAAA" &&
												!ipv6Regex.test(value)
											) {
												return "Content must be a valid IPv6 address";
											}
											if (
												type === "CNAME" &&
												!hostnameRegex.test(value)
											) {
												return "Content must be a valid hostname for CNAME";
											}
											return true; // valid
										},
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												Content
											</FormLabel>
											<FormControl>
												<Input
													autoComplete="off"
													className="text-base"
													placeholder={getPlaceholder(
														form.watch("type")
													)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="ttl"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												TTL (seconds)
											</FormLabel>
											<Select
												onValueChange={(value) =>
													field.onChange(
														parseInt(value)
													)
												}
												defaultValue={field.value.toString()}
											>
												<FormControl>
													<SelectTrigger className="text-base">
														<SelectValue placeholder="Select TTL" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{ttlOptions.map(
														(option) => (
															<SelectItem
																key={
																	option.value
																}
																value={
																	option.value
																}
																className="text-base"
															>
																{option.label}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter>
									<Button
										type="submit"
										className="text-base"
										disabled={saving}
									>
										{saving ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{editingRecord
													? "Updating..."
													: "Creating..."}
											</>
										) : editingRecord ? (
											"Update Record"
										) : (
											"Create Record"
										)}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<Input
				placeholder="Search DNS Records..."
				type="search"
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{/* DNS Records */}
			{dnsRecords.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
					<Globe className="h-8 w-8 text-primary" />
					<p className="text-lg text-primary">No DNS records found</p>
					<Button onClick={openCreateDialog}>
						<Plus className="h-4 w-4 mr-2" /> Create Your First DNS
						Record
					</Button>
				</div>
			) : filteredRecords.length === 0 ? (
				<p className="text-center text-muted-foreground">
					No subdomains match your search.
				</p>
			) : (
				<div className="overflow-x-auto border rounded-lg">
					<div className="w-full overflow-x-auto">
						<table className="w-full table-fixed text-left border-collapse">
							<thead>
								<tr className="bg-muted/40 text-sm md:text-base text-muted-foreground">
									<th className="px-4 py-3 w-[10%]">Type</th>
									<th className="px-4 py-3 w-[20%]">Name</th>
									<th className="px-4 py-3 w-[40%]">
										Content
									</th>
									<th className="px-4 py-3 w-[15%]">TTL</th>
									<th className="px-4 py-3 w-[15%]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredRecords.map((record) => (
									<tr
										key={record._id}
										className="border-t hover:bg-muted/30 transition"
									>
										<td className="px-4 py-3 font-medium">
											{record.type}
										</td>
										<td className="px-4 py-3">
											{record.name}
										</td>
										<td
											className="px-4 py-3 font-mono break-all cursor-pointer"
											onClick={handleCopy}
										>
											{record.content}
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											<Clock className="inline h-4 w-4 mr-1" />{" "}
											{record.ttl}s
										</td>
										<td className="px-4 py-3 flex gap-2">
											<Button
												variant="secondary"
												className="text-sm md:text-base"
												onClick={() =>
													openEditDialog(record)
												}
											>
												<Edit className="h-4 w-4 mr-1" />{" "}
												Edit
											</Button>
											<Button
												variant="destructive"
												className="text-sm md:text-base"
												onClick={() =>
													handleDelete(record._id)
												}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
