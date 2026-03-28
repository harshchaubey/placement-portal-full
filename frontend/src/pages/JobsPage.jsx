// src/pages/JobsPage.jsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllJobs } from "../api/jobApi"; 
import { GraduationCap, MapPin, ArrowRight, ArrowLeft, Search, Bookmark } from "lucide-react";
import "./landing.css";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const locationParam = params.get("location") || "";

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");

    // 🔥 NOT LOGGED IN
    if (!token) {
      alert("🔒 Please login or register first to apply for this position!");
      navigate(`/login?redirect=/jobs&applyJobId=${jobId}`);
      return;
    }

    // ✅ LOGGED IN
    try {
      // NOTE: backend apply API not yet implemented per user instruction
      // await applyToJob(jobId);
      alert("Applied successfully ✅ (Mocked)");
    } catch (err) {
      alert("Already applied ❌");
    }
  };

  // Auto-apply logic for returning users after authentication
  useEffect(() => {
    const applyJobId = params.get("applyJobId");
    const token = localStorage.getItem("token");
    
    if (applyJobId && token) {
      // Execute the apply flow automatically
      handleApply(applyJobId);
      
      // Clean up the URL so it doesn't trigger again on refresh
      params.delete("applyJobId");
      params.delete("redirect");
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search]);

  useEffect(() => {
    getAllJobs().then((res) => {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.jobs || [];

      // Render the newest jobs first
      setJobs([...data].reverse());
    });
  }, []);

  const search = (keyword || "").toLowerCase().trim();
  const locSearch = (locationParam || "").toLowerCase().trim();

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();
    const loc = (job.location || job.companyLocation || job.companyName || "").toLowerCase();

    // ✅ separate conditions
    if (search && locSearch) {
      return (
        (title.includes(search) || desc.includes(search)) &&
        loc.includes(locSearch)
      );
    }

    if (search) {
      return title.includes(search) || desc.includes(search);
    }

    if (locSearch) {
      return loc.includes(locSearch);
    }

    return true; // show all if nothing typed
  });

  return (
    <div className="landing-wrapper" style={{ minHeight: "100vh" }}>
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      <div className="landing-content">
        {/* 🔝 GLASS NAVBAR */}
        <nav className="glass-nav">
          <div className="brand-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <GraduationCap className="text-primary" size={32} />
            PlacePort
          </div>
          <div className="nav-buttons">
            <button className="btn-login" onClick={() => navigate("/")}>
              <ArrowLeft size={16} style={{ marginRight: "0.5rem", verticalAlign: "sub" }} />
              Back to Home
            </button>
          </div>
        </nav>

        {/* 📋 HEADER SUMMARY */}
        <div style={{ padding: "4rem 5rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
            <span className="text-gradient">Explore Opportunities</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Showing <b>{filteredJobs.length}</b> matches
            {keyword && <> for "<span style={{ color: "var(--text-main)" }}>{keyword}</span>"</>}
            {locationParam && <> in "<span style={{ color: "var(--text-main)" }}>{locationParam}</span>"</>}
          </p>
        </div>

        {/* ❌ NO JOBS */}
        {filteredJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)", background: "var(--glass-bg)", margin: "0 5rem", borderRadius: "20px", border: "1px solid var(--glass-border)", backdropFilter: "blur(12px)" }}>
            <Search size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
            <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>No jobs found</h3>
            <p>Try different keywords or adjusting your location filters.</p>
            <button className="btn-gradient mt-4" onClick={() => navigate("/jobs")}>Clear Filters</button>
          </div>
        ) : (
          /* 🔲 JOB GRID USING PREMIUM CARDS */
          <div className="jobs-grid" style={{ padding: "0 5rem 5rem" }}>
            {filteredJobs.map((job) => (
              <div className="job-preview-card" style={{ height: "100%" }} key={job._id || job.id}>
                
                <div className="job-header-row">
                  <h3>{job.title || "No Title"}</h3>
                  <span className="job-type-badge">{job.jobType || "Full-time"}</span>
                </div>
                
                <div className="job-salary">
                  {job.salary ? `💰 ${job.salary}` : "💰 Not Disclosed"}
                </div>

                <div className="job-skills">
                  {(job.requirements || job.skills || ["React.js", "Node.js", "MongoDB", "Express"]).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                  {(job.requirements || job.skills || ["React.js", "Node", "Mongo", "Express"]).length > 3 && <span className="skill-chip">+</span>}
                </div>

                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                  <span style={{ marginRight: "1rem" }}>📚 CGPA ≥ {job.minCgpa || "N/A"}</span>
                  <span>📅 {job.lastDate || "Open Deadline"}</span>
                </div>

                <div className="job-footer-row" style={{ marginTop: "auto" }}>
                  <span className="job-company">{job.company?.name || job.companyName || "Premium Partner"}</span>
                  <div className="job-location">
                    <MapPin size={14} />
                    {job.location || "Remote / Hybrid"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button 
                    className="btn-apply" 
                    style={{ flex: 1, background: "linear-gradient(135deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }}
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now <ArrowRight size={16} style={{marginLeft: "5px", verticalAlign: "sub"}}/>
                  </button>
                  <button 
                    className="btn-apply"
                    style={{ flex: 1 }}
                  >
                    <Bookmark size={16} style={{marginRight: "5px", verticalAlign: "middle"}}/> Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default JobsPage;