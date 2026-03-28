import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getCurrentUser, getCompanyProfile, getApplicationsByJob } from "../api/authApi";
import { createJob, getCompanyJobs } from "../api/jobApi";
import { createPortal } from "react-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  User, 
  LogOut, 
  MapPin, 
  Building, 
  Mail, 
  Users, 
  CheckCircle,
  GraduationCap
} from "lucide-react";

function CompanyDashboard() {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profile, setProfile] = useState({});
  const [showApplicants, setShowApplicants] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    minCgpa: "",
    salary: "",
    skills: ""
  });

  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Post Job", icon: <PlusCircle size={20} /> },
    { name: "My Jobs", icon: <Briefcase size={20} /> },
    { name: "Profile", icon: <User size={20} /> }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePostJob = async () => {
    try {
      const payload = {
        ...jobData,
        skills: jobData.skills ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      await createJob(payload);
      alert("Job posted successfully ✅");
      setJobData({
        title: "",
        description: "",
        minCgpa: "",
        salary: "",
        skills: ""
      });
      
      // refresh jobs
      const res = await getCompanyJobs();
      setJobs(res.data);

      setActiveMenu("My Jobs"); 
    } catch (err) {
      console.error(err);
      alert("Error posting job ❌");
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await getApplicationsByJob(jobId);
      setJobApplications(
        Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.applications || []
      );
      setShowApplicants(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data);

        const profileRes = await getCompanyProfile();
        setProfile(profileRes.data);

        const res = await getCompanyJobs();
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      
      {/* 🔮 Background Glow */}
      <div className="landing-bg-glow"></div>

      {/* 🔵 SIDEBAR */}
      <div className="sidebar">
        <div className="brand-logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <GraduationCap className="icon" size={32} />
          PlacePort
        </div>

        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeMenu === item.name ? "active" : ""}
              onClick={() => setActiveMenu(item.name)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>

        <div className="logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>

      {/* 🔷 MAIN */}
      <div className="main-content">
        
        {/* 🔝 TOPBAR */}
        <div className="topbar">
          <h2>{activeMenu}</h2>
          <div className="profile-badge" style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)'}}>
            <Building size={18} color="var(--primary)" />
            <span style={{fontWeight: '600'}}>{user?.name || "Company Portal"}</span>
          </div>
        </div>

        {/* 🔥 DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <div className="animate__animated animate__fadeIn">
            <div className="welcome-widget">
              <h1>Welcome back, <span style={{color: '#ff0080'}}>{user?.name?.split(' ')[0] || "Partner"}</span> 👋</h1>
              <p>Here's what's happening with your job postings today.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Briefcase strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.length}</h3>
                  <p>Active Postings</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#ff0080', background: 'rgba(255, 0, 128, 0.1)'}}>
                  <Users strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Total Applicants</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}>
                  <CheckCircle strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Hired Students</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🟢 POST JOB */}
        {activeMenu === "Post Job" && (
          <div className="glass-form-card animate__animated animate__fadeInUp">
            <h3>🚀 Create New Posting</h3>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Select or enter job title"
                list="job-titles"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              />
              <datalist id="job-titles">
                <option value="Software Engineer" />
                <option value="Frontend Developer" />
                <option value="Backend Developer" />
                <option value="Full Stack Developer" />
                <option value="Android Developer" />
                <option value="Data Analyst" />
                <option value="UI/UX Designer" />
                <option value="Cybersecurity" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Role Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe the responsibilities and expectations..."
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
            </div>

            <div style={{display: 'flex', gap: '1.5rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Minimum CGPA</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 7.5"
                  value={jobData.minCgpa}
                  onChange={(e) => setJobData({ ...jobData, minCgpa: e.target.value })}
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label>Salary Range</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10LPA - 15LPA"
                  value={jobData.salary}
                  onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Required Skills (Comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. React.js, Node.js, Mongoose"
                value={jobData.skills}
                onChange={(e) => setJobData({ ...jobData, skills: e.target.value })}
              />
            </div>

            <button onClick={handlePostJob} className="btn-glossy" style={{marginTop: '2rem'}}>
              <PlusCircle size={20} /> Publish Job Posting
            </button>
          </div>
        )}

        {/* 🔵 MY JOBS */}
        {activeMenu === "My Jobs" && (
          <div className="animate__animated animate__fadeIn">
            {jobs.length === 0 ? (
              <div style={{textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)'}}>
                <Briefcase size={48} style={{opacity: 0.3, marginBottom: '1rem'}} />
                <h3>No active postings yet</h3>
                <p style={{color: 'var(--text-muted)'}}>Head over to 'Post Job' to publish your first role.</p>
                <button onClick={() => setActiveMenu('Post Job')} className="btn-glossy" style={{width: 'auto', padding: '0.8rem 2rem', margin: '2rem auto 0'}}>Create Posting</button>
              </div>
            ) : (
              <div className="jobs-grid-glass">
                {jobs.map((job) => (
                  <div className="job-glass-card" key={job.id}>
                    <div className="job-glass-header">
                      <h3>{job.title}</h3>
                      <span className="glass-badge">CGPA ≥ {job.minCgpa}</span>
                    </div>
                    
                    <p className="job-glass-desc">{job.description?.substring(0, 100)}{job.description?.length > 100 ? '...' : ''}</p>
                    
                    <div style={{marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                      {job.salary && <div style={{marginBottom: '0.3rem'}}>💰 {job.salary}</div>}
                    </div>

                    <div className="job-glass-actions">
                      <button className="btn-glass-action primary" onClick={() => handleViewApplicants(job.id)}>
                        <Users size={16} /> Applicants
                      </button>
                      <button className="btn-glass-action danger">
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🟢 PROFILE */}
        {activeMenu === "Profile" && (
          <div className="profile-glass-card animate__animated animate__fadeIn">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile?.companyName?.charAt(0) || user?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h2 style={{margin: '0 0 0.2rem 0', padding: 0, border: 'none'}}>{profile?.companyName || user?.name || "Company Name"}</h2>
                <p style={{color: 'var(--text-muted)', margin: 0}}>Official Verified Partner</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-field-glass">
                <div className="profile-field-icon"><Building /></div>
                <div className="profile-field-info">
                  <label>Company Display Name</label>
                  <span>{profile?.companyName || user?.name || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass">
                <div className="profile-field-icon" style={{color: '#ff0080', background: 'rgba(255, 0, 128, 0.1)'}}><Mail /></div>
                <div className="profile-field-info">
                  <label>Registered Email</label>
                  <span>{profile?.email || user?.email || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{gridColumn: '1 / -1'}}>
                <div className="profile-field-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}><MapPin /></div>
                <div className="profile-field-info">
                  <label>Headquarters / Location</label>
                  <span>{profile?.location || "Location not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🧊 MODAL */}
        {showApplicants &&
          createPortal(
            <div className="glass-modal-overlay animate__animated animate__fadeIn">
              <div className="glass-modal-content animate__animated animate__zoomIn">
                <h2>Applicant Tracking</h2>
                
                {jobApplications.length > 0 ? (
                  jobApplications.map((app) => (
                    <div key={app.id} className="applicant-card">
                      <h3>{app.studentName}</h3>
                      <p>Applied for: {app.jobTitle}</p>
                      <p style={{color: '#ff0080'}}>Status: {app.status}</p>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign: 'center', padding: '2rem 0'}}>
                    <Users size={48} style={{opacity: 0.3, marginBottom: '1rem'}} />
                    <p style={{color: 'var(--text-muted)'}}>No applications received yet.</p>
                  </div>
                )}

                <button 
                  onClick={() => setShowApplicants(false)}
                  className="btn-glass-action" 
                  style={{marginTop: '2rem', width: '100%'}}
                >
                  Close Window
                </button>
              </div>
            </div>,
            document.body
          )
        }
      </div>
    </div>
  );
}

export default CompanyDashboard;