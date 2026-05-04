import { Logo } from "@/components/Logo";
import { useState } from "react";

export default function AdminPaymentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!file) {
      alert("Please upload payment screenshot");
      return;
    }

    // Later you will send this to backend / Firebase
    console.log("Uploaded file:", file);

    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      
      <Logo size="md" className="mb-4" />

      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Admin Access Payment</h1>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", textDecoration: "line-through", marginBottom: "0.25rem" }}>Real Price: ₹4,999</p>
        <p style={{ color: "#22c55e", fontSize: "1.25rem", fontWeight: "900" }}>Offer Price: ₹3,999</p>
        <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.25rem" }}>₹1,000 Discount for New Admins!</p>
      </div>

      {/* QR CODE */}
      <div style={{ position: "relative" }}>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9800820296@fam%26am=3999%26cu=INR%26pn=Infinity%20Admin"
          alt="QR Code"
          style={{ 
            width: "250px", 
            margin: "10px 0", 
            borderRadius: "15px",
            border: "8px solid white",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
        />
        <div style={{ position: "absolute", bottom: "10px", left: "0", right: "0", textAlign: "center" }}>
           <span style={{ background: "#22c55e", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" }}>PAY ₹3999</span>
        </div>
      </div>

      <p style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>UPI ID: <b>9800820296@fam</b></p>

      {/* Upload Section */}
      <div style={{ 
        background: "rgba(30, 41, 59, 0.5)", 
        padding: "2rem", 
        borderRadius: "1rem", 
        border: "1px border solid #334155",
        textAlign: "center"
      }}>
        <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#94a3b8" }}>Upload Payment Screenshot</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{
            display: "block",
            width: "100%",
            color: "#94a3b8",
            fontSize: "0.875rem"
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          background: "#22c55e",
          border: "none",
          borderRadius: "0.75rem",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "#16a34a"}
        onMouseOut={(e) => e.currentTarget.style.background = "#22c55e"}
      >
        Submit Payment Proof
      </button>

      {submitted && (
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          background: "rgba(34, 197, 94, 0.1)", 
          border: "1px solid #22c55e", 
          borderRadius: "0.5rem",
          color: "#4ade80" 
        }}>
          Payment submitted! Please wait for approval manually.
        </div>
      )}
    </div>
  );
}
