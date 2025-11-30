import { useState } from "react";
import client from "../api/client";
import toast, { Toaster } from "react-hot-toast";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  pan: "",
  aadhaar: "",
  age: "",
  monthly_income: "",
  existing_emi: "",
  requested_loan_amount: "",
  requested_tenure_months: "",
};

export default function LoanForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Normalize inputs
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pan: form.pan.toUpperCase().trim(),
        aadhaar: form.aadhaar.replace(/\s+/g, "").trim(),
        age: Number(form.age),
        monthly_income: Number(form.monthly_income),
        existing_emi: Number(form.existing_emi),
        requested_loan_amount: Number(form.requested_loan_amount),
        requested_tenure_months: Number(form.requested_tenure_months),
      };

      // Client-side validation
      if (!/^[6-9][0-9]{9}$/.test(payload.phone)) {
        toast.error("Invalid phone number. Must be 10 digits starting with 6–9.");
        return;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(payload.pan)) {
        toast.error("Invalid PAN format (e.g., ABCDE1234F).");
        return;
      }
      if (!/^[0-9]{12}$/.test(payload.aadhaar)) {
        toast.error("Aadhaar must be 12 digits (no spaces).");
        return;
      }

      const res = await client.post("/user/apply", payload);
      setResult(res.data);
      setForm(initialForm);
      toast.success("Loan application submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      const msg = err.response?.data?.detail?.[0]?.msg || "Submission failed.";
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e40af",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "0.9rem",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl transition hover:shadow-2xl">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-2">
          Loan Application Form
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Apply for a personal loan in minutes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["full_name", "Full Name", "text"],
            ["email", "Email Address", "email"],
            ["phone", "Phone Number", "text"],
            ["pan", "PAN Number", "text"],
            ["aadhaar", "Aadhaar Number", "text"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min={18}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                name="monthly_income"
                value={form.monthly_income}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing EMI (₹)
            </label>
            <input
              type="number"
              name="existing_emi"
              value={form.existing_emi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Loan Amount (₹)
              </label>
              <input
                type="number"
                name="requested_loan_amount"
                value={form.requested_loan_amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenure (months)
              </label>
              <input
                type="number"
                name="requested_tenure_months"
                value={form.requested_tenure_months}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min={6}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <h2 className="text-green-700 font-semibold">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Your application ID:{" "}
              <span className="font-mono text-green-800">{result.id}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
