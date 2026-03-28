import { useEffect, useState } from "react";
import "./dashboard.css";
import { getAllJobs, getAppliedJobs } from "../api/jobApi";
import { getCurrentUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import { getStudentProfile } from "../api/authApi";
import { applyJob } from "../api/jobApi";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileCheck, 
  User, 
  Settings, 
  LogOut, 
  GraduationCap, 
  Search, 
  Upload, 
  MapPin, 
  CheckCircle,
  FileText,
  Mail
} from "lucide-react";

function StudentDashboard() {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [resumeFiles, setResumeFiles] = useState({});
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (jobId, file) => {
    setResumeFiles(prev => ({
      ...prev,
      [jobId]: file
    }));
  };

  const handleApply = async (jobId) => {
    try {
      const file = resumeFiles[jobId];

      if (!file) {
        alert("Please upload resume first ❗");
        return;
      }

      if (file.type !== "application/pdf") {
        alert("Only PDF allowed ❌");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      await applyJob(jobId, formData);

      // Refresh applications from backend secretly to ensure tabs update
      try {
        const appliedRes = await getAppliedJobs();
        const appData = Array.isArray(appliedRes.data) 
          ? appliedRes.data 
          : appliedRes.data.data || appliedRes.data.applications || [];
        setApplications(appData); 
        setAppliedJobs(appData.map(app => app.jobId || app.job?.id));
      } catch(e) {
        console.error("Warning: Could not refresh applications tab automatically.");
      }

      alert("Applied successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Error applying ❌");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Jobs", icon: <Briefcase size={20} /> },
    { name: "Applications", icon: <FileCheck size={20} /> },
    { name: "Profile", icon: <User size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data);
        
        const jobsRes = await getAllJobs();
        setJobs(jobsRes.data);
      } catch (err) {
        console.error("Error loading core data:", err);
      }

      try {
        const appliedRes = await getAppliedJobs();
        const appData = Array.isArray(appliedRes.data) 
          ? appliedRes.data 
          : appliedRes.data.data || appliedRes.data.applications || [];
          
        setApplications(appData); 
        setAppliedJobs(appData.map(app => app.jobId || app.job?.id));
      } catch (err) {
        console.error("Error loading applications:", err);
      }

      try {
        const ProfileRes = await getStudentProfile();
        setProfile(ProfileRes.data);
      } catch (err) {
        console.error("Error loading profile:", err);
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

      {/* 🔷 MAIN CONTENT */}
      <div className="main-content">

        {/* 🔝 TOPBAR */}
        <div className="topbar">
          <h2>{activeMenu}</h2>
          
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <div className="search-input-group" style={{background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              <Search size={16} color="var(--text-muted)" />
              <input 
                placeholder="Search jobs..." 
                style={{background: 'transparent', border: 'none', color: 'white', outline: 'none', padding: '5px 0'}} 
              />
            </div>
            
            <div className="profile-badge" style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--glass-bg)', padding: '8px 15px', borderRadius: '30px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)'}}>
              <div style={{width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{user?.name?.charAt(0) || "U"}</div>
              <div>
                <div style={{fontWeight: '600', fontSize: '0.9rem', lineHeight: '1'}}>{user?.name || "Student"}</div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{profile?.branch || "Branch"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🟢 DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <div className="animate__animated animate__fadeIn">
            <div className="welcome-widget" style={{background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15), rgba(0, 242, 254, 0.15))'}}>
              <h1>Welcome back, <span style={{color: '#4facfe'}}>{user?.name?.split(' ')[0] || "Student"}</span> 👋</h1>
              <p>{new Date().toDateString()} • Stay updated with your placement journey</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#4facfe', background: 'rgba(79, 172, 254, 0.1)'}}>
                  <Briefcase strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{jobs.length}</h3>
                  <p>Available Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#00e676', background: 'rgba(0, 230, 118, 0.1)'}}>
                  <FileCheck strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{appliedJobs.length}</h3>
                  <p>Applied Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{color: '#ffb20d', background: 'rgba(255, 178, 13, 0.1)'}}>
                  <GraduationCap strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <h3>{profile?.cgpa || 0}</h3>
                  <p>Current CGPA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔵 JOBS BROWSER */}
        {activeMenu === "Jobs" && (
          <div className="animate__animated animate__fadeIn">
            <div className="jobs-grid-glass">
              {jobs.map((job) => (
                <div className="job-glass-card" key={job.id}>
                  <div className="job-glass-header">
                    <h3>{job.title}</h3>
                    <span className="glass-badge" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe', borderColor: 'rgba(79, 172, 254, 0.3)'}}>
                      {job.companyName}
                    </span>
                  </div>
                  
                  <p className="job-glass-desc" style={{marginBottom: "1rem"}}>
                    {job.description || "No description provided by the employer."}
                  </p>
                  
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem', fontSize: '0.85rem', color: "var(--text-muted)"}}>
                    <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                      🎓 Min CGPA: <strong style={{color: '#4facfe'}}>{job.minCgpa}</strong>
                    </div>
                    {job.salary && (
                      <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                        💰 {job.salary}
                      </div>
                    )}
                    {(job.companyLocation || job.location) && (
                      <div style={{background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                        📍 {job.companyLocation || job.location}
                      </div>
                    )}
                  </div>
                  
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px', border: '1px dashed var(--glass-border)'}}>
                      <div style={{background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '5px'}}><Upload size={16} /></div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(job.id, e.target.files[0])}
                        style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}
                      />
                    </div>
                  </div>

                  <div className="job-glass-actions">
                    <button
                      type="button"
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.includes(job.id)}
                      className="btn-glass-action"
                      style={{
                        background: appliedJobs.includes(job.id) ? 'rgba(0, 230, 118, 0.2)' : 'rgba(79, 172, 254, 0.2)',
                        borderColor: appliedJobs.includes(job.id) ? 'rgba(0, 230, 118, 0.4)' : 'rgba(79, 172, 254, 0.4)',
                        color: appliedJobs.includes(job.id) ? '#00e676' : 'white',
                        width: '100%'
                      }}
                    >
                      {appliedJobs.includes(job.id) ? <><CheckCircle size={16}/> Applied Successfully</> : "Apply Now →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🟡 APPLICATIONS */}
        {activeMenu === "Applications" && (
          <div className="animate__animated animate__fadeIn">
            {applications.length === 0 ? (
              <div style={{textAlign: 'center', padding: '5rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)'}}>
                <FileCheck size={48} style={{opacity: 0.3, marginBottom: '1rem', color: '#00e676'}} />
                <h3>No applications yet</h3>
                <p style={{color: 'var(--text-muted)'}}>Head over to the Jobs tab to start applying!</p>
                <button onClick={() => setActiveMenu('Jobs')} className="btn-glossy" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', width: 'auto', padding: '0.8rem 2rem', margin: '2rem auto 0'}}>Browse Jobs</button>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {applications.map((app) => (
                  <div key={app.id} className="job-glass-card" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem'}}>
                    <div>
                      <h3 style={{margin: '0 0 0.5rem 0'}}>{app.jobTitle}</h3>
                      <p style={{margin: 0, color: 'var(--text-muted)'}}>{app.companyName}</p>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>Status</div>
                        <span style={{ color: "#00e676", fontWeight: "bold", fontSize: '1.1rem' }}>
                          {app.status}
                        </span>
                      </div>
                      
                      <a
                        href={app.resumePath?.startsWith("http") ? app.resumePath : `https://placement-portal-full-production.up.railway.app/uploads/${app.resumePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-glass-action"
                        style={{background: 'rgba(255,255,255,0.05)', textDecoration: 'none', padding: '0.6rem 1.2rem', color: 'var(--text-main)'}}
                      >
                        <FileText size={16} /> View Resume 
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🟣 PROFILE */}
        {activeMenu === "Profile" && (
          <div className="profile-glass-card animate__animated animate__fadeIn">
            <div className="profile-header" style={{borderBottomColor: 'rgba(79, 172, 254, 0.2)'}}>
              <div className="profile-avatar" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', boxShadow: '0 10px 20px rgba(79, 172, 254, 0.3)'}}>
                 {profile?.name?.charAt(0) || user?.name?.charAt(0) || "S"}
              </div>
              <div>
                <h2 style={{margin: '0 0 0.2rem 0', padding: 0, border: 'none'}}>{profile?.name || user?.name || "Student Name"}</h2>
                <p style={{color: '#4facfe', margin: 0, fontWeight: '500'}}>{profile?.branch || "-"} • Class of {profile?.year || "-"}</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-field-glass" style={{borderLeftColor: '#4facfe'}}>
                <div className="profile-field-icon" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe'}}><User /></div>
                <div className="profile-field-info">
                  <label>Full Name</label>
                  <span>{profile?.name || user?.name || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#4facfe'}}>
                <div className="profile-field-icon" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe'}}><Mail /></div>
                <div className="profile-field-info">
                  <label>College Email</label>
                  <span>{user?.email || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#00e676'}}>
                <div className="profile-field-icon" style={{background: 'rgba(0, 230, 118, 0.1)', color: '#00e676'}}><CheckCircle /></div>
                <div className="profile-field-info">
                  <label>Roll Number</label>
                  <span>{profile?.rollNo || "Not Set"}</span>
                </div>
              </div>

              <div className="profile-field-glass" style={{borderLeftColor: '#ffb20d'}}>
                <div className="profile-field-icon" style={{background: 'rgba(255, 178, 13, 0.1)', color: '#ffb20d'}}><GraduationCap /></div>
                <div className="profile-field-info">
                  <label>Aggregate CGPA</label>
                  <span>{profile?.cgpa || "0.0"}</span>
                </div>
              </div>
            </div>

            <button className="btn-glossy" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', marginTop: '3rem', width: 'auto', padding: '1rem 3rem', marginLeft: 'auto', display: 'flex', boxShadow: '0 10px 20px rgba(79, 172, 254, 0.3)'}}>
              Edit Profile details
            </button>
          </div>
        )}
        
        {/* Settings Stub */}
        {activeMenu === "Settings" && (
           <div className="animate__animated animate__fadeIn" style={{textAlign: 'center', padding: '5rem'}}>
             <Settings size={48} style={{opacity: 0.3, marginBottom: '1rem', color: 'var(--text-muted)'}} />
             <h3>Account Settings</h3>
             <p style={{color: 'var(--text-muted)'}}>Password and security settings coming soon.</p>
           </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;
