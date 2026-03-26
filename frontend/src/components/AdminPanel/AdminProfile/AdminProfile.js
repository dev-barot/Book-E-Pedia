import React, { useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import '../AdminCommon.css';

function AdminProfile() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Premium ambient animated background elements */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
        {/* HEADER SECTION */}
        <div className="admin-header-section">
          <div className="admin-header-titles">
            <h1 className="text-gradient-lux">Admin Profile</h1>
            <p>Manage your account settings, personal details, and preferences.</p>
          </div>
        </div>

        {/* PROFILE FORM SECTION */}
        <div className="admin-table-wrapper glass-card" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '25px', color: 'var(--color-primary-dark)', borderBottom: '1px solid rgba(31,78,121,0.1)', paddingBottom: '15px' }}>
            <i className="fa-solid fa-user-shield" style={{ marginRight: '10px' }}></i> Update Profile Information
          </h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="firstName" style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(31,78,121,0.2)',
                    background: 'rgba(255,255,255,0.5)',
                    color: 'var(--color-text-main)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid var(--color-primary-light)'; e.target.style.background = 'rgba(255,255,255,0.8)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(31,78,121,0.2)'; e.target.style.background = 'rgba(255,255,255,0.5)'; }}
                  placeholder="e.g., John"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="lastName" style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(31,78,121,0.2)',
                    background: 'rgba(255,255,255,0.5)',
                    color: 'var(--color-text-main)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid var(--color-primary-light)'; e.target.style.background = 'rgba(255,255,255,0.8)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(31,78,121,0.2)'; e.target.style.background = 'rgba(255,255,255,0.5)'; }}
                  placeholder="e.g., Doe"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="username" style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Username</label>
              <input
                type="text"
                id="username"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(31,78,121,0.2)',
                  background: 'rgba(255,255,255,0.5)',
                  color: 'var(--color-text-main)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => { e.target.style.border = '1px solid var(--color-primary-light)'; e.target.style.background = 'rgba(255,255,255,0.8)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid rgba(31,78,121,0.2)'; e.target.style.background = 'rgba(255,255,255,0.5)'; }}
                placeholder="e.g., johndoe_admin"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Email Address</label>
              <input
                type="email"
                id="email"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(31,78,121,0.2)',
                  background: 'rgba(255,255,255,0.5)',
                  color: 'var(--color-text-main)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => { e.target.style.border = '1px solid var(--color-primary-light)'; e.target.style.background = 'rgba(255,255,255,0.8)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid rgba(31,78,121,0.2)'; e.target.style.background = 'rgba(255,255,255,0.5)'; }}
                placeholder="e.g., admin@bookepedia.com"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="profileImg" style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Profile Image</label>
              <input
                type="file"
                id="profileImg"
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px dashed rgba(31,78,121,0.4)',
                  background: 'rgba(255,255,255,0.3)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.6)'; }}
                onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.3)'; }}
              />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn-primary-lux" 
                style={{ padding: '12px 30px', fontSize: '1rem' }}
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-content"><i className="fa-solid fa-save"></i> Save Changes</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default AdminProfile;
