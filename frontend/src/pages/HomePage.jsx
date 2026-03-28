import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllJobs } from "../api/jobApi";
import { Search, MapPin, Briefcase, GraduationCap, TrendingUp, Users, ArrowRight, CheckCircle, Flame, Code, Database, LineChart, Megaphone, PenTool, Shield } from "lucide-react";
import "./landing.css";

function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    navigate(`/jobs?keyword=${keyword.trim()}&location=${location.trim()}`);
  };

  useEffect(() => {
    getAllJobs().then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setJobs(data);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }
    const filteredJobs = jobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const desc = (job.description || "").toLowerCase();
      return title.includes(keyword.toLowerCase()) || desc.includes(keyword.toLowerCase());
    });
    setSuggestions(filteredJobs.slice(0, 4));
  }, [keyword, jobs]);

  const latestJobs = [...jobs].reverse().slice(0, 3); // Get 3 latest jobs

  const categories = [
    { name: "Software Engineer", icon: <Code size={24} />, count: "120+ Jobs" },
    { name: "Data Analyst", icon: <Database size={24} />, count: "85+ Jobs" },
    { name: "Finance", icon: <LineChart size={24} />, count: "40+ Jobs" },
    { name: "Marketing", icon: <Megaphone size={24} />, count: "60+ Jobs" },
    { name: "UI/UX Designer", icon: <PenTool size={24} />, count: "35+ Jobs" },
    { name: "Cybersecurity", icon: <Shield size={24} />, count: "25+ Jobs" },
  ];

  return (
    <div className="landing-wrapper">
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      <div className="landing-content">
        {/* 🔝 GLASS NAVBAR */}
        <nav className="glass-nav">
          <div className="brand-logo">
            <GraduationCap className="text-primary" size={32} />
            PlacePort
          </div>
          <div className="nav-buttons">
            <button className="btn-login" onClick={() => navigate("/login")}>
              Log in
            </button>
            <button className="btn-gradient" onClick={() => navigate("/register")}>
              Sign Up Free
            </button>
          </div>
        </nav>

        {/* 🔍 TOP SEARCH BAR */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto 0', padding: '0 2rem', position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <div className="floating-search" style={{ marginTop: '0', width: '100%' }}>
            <div className="search-input-group">
              <Search size={20} />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
              
              {/* Suggestions Dropdown */}
              {isFocused && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((job) => (
                    <div
                      key={job.id || job._id || job.title}
                      className="suggestion-item"
                      onMouseDown={() => {
                        setKeyword(job.title);
                        setSuggestions([]);
                      }}
                    >
                      {job.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="search-input-group" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', background: 'transparent' }}>
              <MapPin size={20} />
              <input
                type="text"
                placeholder="City, state, remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button className="btn-search" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* 🎯 HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '2rem' }}>
          <div className="hero-text">
            <h1>
              Accelerate Your <br />
              <span className="text-gradient">Career Journey</span>
            </h1>
            <p>
              Connect with top-tier companies, showcase your skills, and secure your
              dream placement through our intelligent portal.
            </p>

            <div className="hero-actions">
              <button className="btn-gradient" onClick={() => navigate("/register")}>
                Get Started
              </button>
              <button className="btn-outline" onClick={() => navigate("/jobs")}>
                Browse Jobs
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-img-wrapper">
              <img src="/hero_premium.png" alt="Premium 3D Tech Placement Illustration" />
            </div>
          </div>
        </section>

        {/* 🚀 LATEST JOBS SECTION */}
        <section className="latest-jobs-section">
          <h2 className="section-title">
            Latest <span className="text-gradient">Opportunities</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "-2rem", marginBottom: "3rem" }}>
            Handpicked roles just added to our platform.
          </p>

          <div className="jobs-grid">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <div className="job-preview-card" key={job._id || job.id}>
                  <div className="job-header-row">
                    <h3>{job.title}</h3>
                    <span className="job-type-badge">{job.jobType || "Full-time"}</span>
                  </div>
                  
                  <div className="job-salary">
                    {job.salary ? `💰 ${job.salary}` : ""}
                  </div>

                  <div className="job-skills">
                    {(job.requirements || job.skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-chip">{skill}</span>
                    ))}
                    {(job.requirements || job.skills || []).length > 3 && <span className="skill-chip">+</span>}
                  </div>

                  <div className="job-footer-row">
                    <span className="job-company">{job.companyName || "Premium Partner"}</span>
                    <div className="job-location">
                      <MapPin size={14} />
                      {job.companyLocation || job.location || "Remote / Hybrid"}
                    </div>
                  </div>

                  <button 
                    className="btn-apply" 
                    onClick={() => navigate(`/jobs`)}
                  >
                    View & Apply <ArrowRight size={16} style={{marginLeft: "5px", verticalAlign: "sub"}}/>
                  </button>
                </div>
              ))
            ) : (
              <div className="job-preview-card" style={{gridColumn: "1 / -1", textAlign: "center"}}>
                <h3>Loading latest jobs...</h3>
              </div>
            )}
          </div>
        </section>

        {/* 🗂 TOP CATEGORIES SECTION */}
        <section className="categories-section">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title" style={{marginBottom: "0.5rem", textAlign: "left"}}>Explore by <span className="text-gradient">Category</span></h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "3rem", textAlign: "left" }}>Find the role that fits your passion and skills perfectly.</p>
            </div>
            <button className="btn-outline" style={{padding: "0.8rem 1.5rem", borderRadius: "50px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "white", marginBottom: "3rem"}} onClick={() => navigate('/jobs')}>All Categories <ArrowRight size={16} style={{marginLeft: "0.5rem", verticalAlign: "sub"}}/></button>
          </div>
          
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div className="category-card" key={idx} onClick={() => navigate(`/jobs?keyword=${cat.name}`)}>
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📈 IMPACT SECTION */}
        <section className="impact-section">
          <div className="impact-grid">
            <div className="impact-stat">
              <h2>10k+</h2>
              <p>Students Placed</p>
            </div>
            <div className="impact-stat">
              <h2>500+</h2>
              <p>Hiring Partners</p>
            </div>
            <div className="impact-stat">
              <h2>95%</h2>
              <p>Success Rate</p>
            </div>
          </div>
        </section>

        {/* 🏢 COMPANIES MARQUEE */}
        <section className="companies-section">
          <div className="companies-title">Trusted By Industry Leaders</div>
          <div className="marquee-container">
            <div className="marquee-content">
              {/* Duplicating for infinite effect */}
              {[...Array(2)].map((_, idx) => (
                <span key={idx} style={{ display: 'inline-flex' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" alt="Infosys" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Wipro_Primary_Logo_Color_RGB.svg" alt="Wipro" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" alt="TCS" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ✨ FEATURES SECTION */}
        <section className="features-section">
          <h2 className="section-title">Why Choose <span className="text-gradient">PlacePort</span></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Briefcase size={28} />
              </div>
              <h3>Exclusive Opportunities</h3>
              <p>Get access to premium internship and full-time roles posted directly by our verified corporate partners.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp size={28} />
              </div>
              <h3>Smart Matching</h3>
              <p>Our intelligent system matches your skills, projects, and academic profile with the perfect job descriptions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={28} />
              </div>
              <h3>Seamless Networking</h3>
              <p>Connect with alumni, schedule interviews directly on the platform, and track your application status in real time.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;