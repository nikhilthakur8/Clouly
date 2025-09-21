import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Eye, Loader2, Trash2, Copy, ExternalLink, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DomainFormData = {
	name: string;
	notes?: string;
};

export const Index = () => {
	const [domains, setDomains] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Dashboard - Clouly";

		async function handleGetMySubDomain() {
			try {
				setLoading(true);
				const response = await api.get("subdomain");
				setDomains(response.data.data || []);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		handleGetMySubDomain();
	}, []);

	const form = useForm<DomainFormData>({
		defaultValues: {
			name: "",
			notes: undefined,
		},
	});

	const onSubmit = async (values: DomainFormData) => {
		try {
			setSaving(true);
			const response = await api.post("subdomain", values);
			setDomains((prev) => [response.data.data, ...prev]);
			toast.success(
				response.data.message || "Subdomain created Successfully"
			);
			form.reset();
			setOpen(false);
		} catch (err: unknown) {
			console.error(err);
			toast.error(
				(err as { response?: { data?: { message?: string } } }).response
					?.data?.message ||
					"Failed to create subdomain. Please try again."
			);
		} finally {
			setSaving(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteId) return;
		try {
			setDeleting(true);
			await api.delete(`subdomain/${deleteId}`);
			setDomains((prev) => prev.filter((d) => d._id !== deleteId));
			toast.success("Subdomain deleted successfully");
			setDeleteId(null);
		} catch (err: unknown) {
			console.error(err);
			toast.error(
				(err as { response?: { data?: { message?: string } } }).response
					?.data?.message || "Failed to delete subdomain"
			);
		} finally {
			setDeleting(false);
		}
	};

	const handleSubDomainCopy = (domain: { name: string }) => {
		navigator.clipboard.writeText(domain.name + ".clouly.in");
		toast.info(`Copied ${domain.name}.clouly.in to clipboard`);
	};

	const [searchTerm, setSearchTerm] = useState("");
	const filteredDomains = domains.filter((domain) =>
		domain.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
						My Subdomains
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground mt-1">
						Manage and monitor your subdomains
					</p>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="text-base">
							<Plus /> Add SubDomain
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="text-xl">
								Add a new subdomain
							</DialogTitle>
						</DialogHeader>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="name"
									rules={{
										required: "Subdomain Name is required",
										minLength: {
											value: 2,
											message:
												"Subdomain Name must be at least 2 characters",
										},
										pattern: {
											value: /^[a-z0-9-]+$/,
											message:
												"Subdomain name must be lowercase alphanumeric or hyphen",
										},
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												Subdomain Name
											</FormLabel>
											<FormControl>
												<Input
													autoComplete="off"
													className="text-base"
													placeholder="api, dashboard, nikhil, etc..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="notes"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">
												Notes
											</FormLabel>
											<FormControl>
												<Textarea
													className="text-base"
													placeholder="Optional notes..."
													{...field}
												/>
											</FormControl>
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
												Saving...
											</>
										) : (
											"Save"
										)}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<Input
				placeholder="Search Subdomains..."
				type="search"
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{/* Table or Empty State */}
			{loading ? (
				<div className="flex justify-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : domains.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
					<p className="text-lg text-primary">No subdomains found</p>
					<Button className="text-base" onClick={() => setOpen(true)}>
						<Plus /> Add Subdomain
					</Button>
				</div>
			) : filteredDomains.length === 0 ? (
				<p className="text-center text-muted-foreground">
					No subdomains match your search.
				</p>
			) : (
				<div className="overflow-x-auto  border rounded-lg">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-muted/40 text-sm md:text-base text-muted-foreground">
								<th className="px-4 py-3 w-[15%]">Name</th>
								<th className="px-4 py-3 w-[40%]">Domain</th>
								<th className="px-4 py-3 w-[30%]">Notes</th>
								<th className="px-4 py-3 w-[15%]">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredDomains.map((domain) => (
								<tr
									key={domain._id}
									className="border-t hover:bg-muted/30 transition"
								>
									<td className="px-4 py-3 font-medium">
										{domain.name}
									</td>
									<td
										className="px-4 py-3 font-mono cursor-pointer hover:text-primary  transition"
										onClick={() =>
											handleSubDomainCopy(domain)
										}
									>
										<div className="flex items-center gap-2">
											<span className="whitespace-nowrap">
												{domain.name}.clouly.in
											</span>
											<Copy size={16} />
											<ExternalLink
												size={16}
												className="text-blue-500 cursor-pointer hover:scale-110 transition"
												onClick={(e) => {
													e.stopPropagation();
													window.open(
														`https://${domain.name}.clouly.in`,
														"_blank"
													);
													toast.info(
														`Redirected to https://${domain.name}.clouly.in`
													);
												}}
											/>
										</div>
									</td>
									<td className="px-4 py-3 text-muted-foreground">
										{domain.notes ? (
											<div className="bg-muted/50 p-2 rounded text-sm max-w-xs truncate">
												{domain.notes}
											</div>
										) : (
											<span className="text-xs italic">
												No notes
											</span>
										)}
									</td>
									<td className="px-4 py-3 flex gap-2">
										<Button
											variant="secondary"
											className="text-sm md:text-base"
											onClick={() =>
												navigate(
													`/subdomain/${domain._id}`
												)
											}
										>
											<Eye className="h-4 w-4 mr-1" />
											View
										</Button>
										<Button
											variant="destructive"
											className="text-sm md:text-base"
											onClick={() =>
												setDeleteId(domain._id)
											}
											disabled={
												deleting &&
												deleteId === domain._id
											}
										>
											{deleting &&
											deleteId === domain._id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4" />
											)}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-lg">
							Confirm Delete
						</DialogTitle>
					</DialogHeader>
					<p className="text-sm md:text-base text-muted-foreground">
						Are you sure you want to delete this subdomain & it's
						DNS records? This action cannot be undone.
					</p>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => setDeleteId(null)}
							disabled={deleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={deleting}
						>
							{deleting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
