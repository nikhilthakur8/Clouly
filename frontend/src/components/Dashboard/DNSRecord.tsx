import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useForm } from "react-hook-form";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
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

	const [subdomain, setSubdomain] = useState<Subdomain | null>(null);
	const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [open, setOpen] = useState(false);
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

				// Fetch subdomain details
				const subdomainResponse = await api.get(
					`subdomain/${subdomainId}`
				);
				setSubdomain(subdomainResponse.data.data);

				// Fetch DNS records
				const dnsResponse = await api.get(
					`subdomain/${subdomainId}/dns`
				);
				setDnsRecords(dnsResponse.data.data || []);

				// Set page title
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
				// Create new record
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
			const errorMessage =
				err && typeof err === "object" && "response" in err
					? (err as { response?: { data?: { message?: string } } })
							.response?.data?.message
					: "Failed to delete DNS record";
			toast.error(errorMessage);
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
		form.reset({
			type: "A",
			content: "",
			ttl: 3600,
		});
		setOpen(true);
	};

	const getRecordIcon = (type: string) => {
		switch (type) {
			case "A":
				return "🌐";
			case "AAAA":
				return "🌏";
			case "CNAME":
				return "🔗";
			case "TXT":
				return "📝";
			default:
				return "📋";
		}
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
				<div className="flex flex-col items-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">
						Loading DNS records...
					</p>
				</div>
			</div>
		);
	}

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
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							DNS Records
						</h1>
						<p className="text-base text-muted-foreground">
							{subdomain?.name}.clouly.in
						</p>
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

			{/* DNS Records */}
			{dnsRecords.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
					<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
						<Globe className="h-8 w-8 text-primary" />
					</div>
					<div className="space-y-2">
						<p className="text-lg text-primary">
							No DNS records found
						</p>
						<p className="text-base text-muted-foreground">
							Create your first DNS record to start directing
							traffic to your subdomain.
						</p>
					</div>
					<Button className="text-base" onClick={openCreateDialog}>
						<Plus className="h-4 w-4 mr-2" />
						Create Your First DNS Record
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{dnsRecords.map((record) => (
						<Card key={record._id}>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-3">
									<span className="text-lg">
										{getRecordIcon(record.type)}
									</span>
									<div>
										<div className="text-base font-semibold">
											{record.type}
										</div>
										<p className="text-sm text-muted-foreground">
											{record.name}
										</p>
									</div>
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-3">
								<div className="bg-accent/30 rounded-lg p-3 border">
									<p className="text-sm font-mono break-all">
										{record.content}
									</p>
								</div>

								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>TTL: {record.ttl}s</span>
									</div>
								</div>
							</CardContent>

							<CardFooter className="flex gap-2">
								<Button
									variant="secondary"
									className="text-base flex-1"
									onClick={() => openEditDialog(record)}
								>
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>

								<Button
									variant="destructive"
									className="text-base"
									onClick={() => handleDelete(record._id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};
