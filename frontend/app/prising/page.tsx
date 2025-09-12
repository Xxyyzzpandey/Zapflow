"use client";

import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: ["Core Automations", "Limited Apps", "Community Support"],
    cta: "Get Started Free",
    type: "primary",
  },
  {
    name: "Pro",
    price: "$15/mo",
    features: ["Unlimited Automations", "All Apps", "Priority Support", "AI Features"],
    cta: "Upgrade to Pro",
    type: "primary",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Dedicated Account Manager", "Custom Integrations", "SLAs & Support"],
    cta: "Contact Sales",
    type: "secondary",
  },
];

export default function PricingPage() {
  return (
    <>
      <Appbar />
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Pricing Plans(comming)</h1>
          <p className="mt-2 text-lg text-gray-700">
            Choose the plan that works best for you and supercharge your automation workflows.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</p>

                <ul className="mt-4 space-y-2 text-gray-700 text-left text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✔</span> {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {plan.type === "primary" ? (
                    <PrimaryButton size="small" onClick={() => {}}>
                      {plan.cta}
                    </PrimaryButton>
                  ) : (
                    <SecondaryButton size="small" onClick={() =>{}}>
                      {plan.cta}
                    </SecondaryButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
