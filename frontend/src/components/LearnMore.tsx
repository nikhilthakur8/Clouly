import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const LearnMore: React.FC = () => {
	const steps = [
		{
			step: 1,
			title: "Create Your Project",
			content: (
				<p className="text-base">
					Go to{" "}
					<a
						className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
						href="https://vercel.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Vercel <ExternalLink className="h-3 w-3" />
					</a>{" "}
					or{" "}
					<a
						className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
						href="https://render.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Render <ExternalLink className="h-3 w-3" />
					</a>{" "}
					and create a new project, for example{" "}
					<code className="bg-accent px-1 py-0.5 rounded text-sm font-mono">
						nikhil-portfolio.clouly.in
					</code>
					.
				</p>
			),
		},
		{
			step: 2,
			title: "Copy CNAME",
			content: (
				<p className="text-base">
					Copy the CNAME content provided by the hosting platform for
					your project. You'll need this for your DNS settings.
				</p>
			),
		},
		{
			step: 3,
			title: "Add Subdomain in Clouly",
			content: (
				<p className="text-base">
					Go to{" "}
					<a
						className="text-primary hover:text-primary/80 underline inline-flex items-center gap-1"
						href="https://clouly.in"
						target="_blank"
						rel="noopener noreferrer"
					>
						Clouly.in <ExternalLink className="h-3 w-3" />
					</a>{" "}
					and create a subdomain like{" "}
					<code className="bg-accent px-1 py-0.5 rounded text-sm font-mono">
						nikhil-portfolio
					</code>
					.
				</p>
			),
		},
		{
			step: 4,
			title: "Create CNAME Record",
			content: (
				<p className="text-base">
					Add a DNS record of type{" "}
					<code className="bg-accent px-1 py-0.5 rounded text-sm font-mono">
						CNAME
					</code>{" "}
					with the copied value. You can keep the default TTL or
					adjust it if needed.
				</p>
			),
		},
		{
			step: 5,
			title: "Wait for DNS Propagation",
			content: (
				<p className="text-base">
					It may take{" "}
					<strong className="text-primary">10–30 minutes</strong> for
					your DNS to propagate. Once done, your website will be live
					on the subdomain!
				</p>
			),
		},
	];

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			{/* Steps */}
			<div className="space-y-4">
				{steps.map((stepData) => (
					<Card key={stepData.step}>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-3">
								<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
									{stepData.step}
								</div>
								Step {stepData.step}: {stepData.title}
							</CardTitle>
						</CardHeader>
						<CardContent>{stepData.content}</CardContent>
					</Card>
				))}
			</div>

			{/* Call to Action */}
			<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
				<CardContent className="pt-6 text-center">
					<h3 className="text-lg font-semibold mb-2">
						Ready to Get Started?
					</h3>
					<p className="text-base text-muted-foreground mb-4">
						Create your first subdomain and start hosting your
						projects today.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button asChild className="text-base">
							<Link to="/dashboard">Start for Free</Link>
						</Button>
						<Button variant="outline" asChild className="text-base">
							<Link to="/">Back to Home</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default LearnMore;
