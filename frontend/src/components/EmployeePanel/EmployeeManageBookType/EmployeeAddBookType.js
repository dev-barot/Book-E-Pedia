
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import './EmployeeAddBookType.css';

function EmployeeAddBookType({ onAddBookType }) {
  


  const location = useLocation();
  const navigate = useNavigate();
  const bookToEdit = location.state?.book;

  // Handle Book_ID generation logic
  const [nextBookId, setNextBookId] = useState(() => {
    const storedId = parseInt(localStorage.getItem('nextBookId'), 10);
    return isNaN(storedId) ? 1 : storedId;
  });

  const generateBookId = () => {
    setNextBookId(prevId => {
      const newId = prevId + 1;
      localStorage.setItem('nextBookId', newId);
      return newId;
    });
  };

  useEffect(() => {
    if (!bookToEdit && !localStorage.getItem('nextBookId')) {
      localStorage.setItem('nextBookId', "1");
    }
  }, [bookToEdit]);

  const [formData, setFormData] = useState({
    Book_Name: bookToEdit ? bookToEdit.Book_Name : '',
    Physical_Book: '0',
    Audio_Book: '0',
    E_Book: '0',
    Video_Book: '0',
    Audio_File: null,
    Video_File: null,
    E_Book_File: null,
    IsActive: '1',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const getCsrfToken = async () => {
    const response = await fetch('http://127.0.0.1:8000/get-csrf-token/');
    const data = await response.json();
    return data.csrfToken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
  
    // Basic Validation
    if (!formData.Book_Name) {
      formErrors.Book_Name = 'Please enter Book Name';
    }
  
    // Check for file types
    if (formData.Audio_Book === '1' && !formData.Audio_File) {
      formErrors.Audio_File = 'Audio file is required';
    }
    if (formData.Video_Book === '1' && !formData.Video_File) {
      formErrors.Video_File = 'Video file is required';
    }
    if (formData.E_Book === '1' && !formData.E_Book_File) {
      formErrors.E_Book_File = 'E-book file is required';
    }
  
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      const formDataToSend = new FormData();
      formDataToSend.append('Book_Name', formData.Book_Name);
      formDataToSend.append('Physical_Book', formData.Physical_Book);
      formDataToSend.append('Audio_Book', formData.Audio_Book);
      formDataToSend.append('E_Book', formData.E_Book);
      formDataToSend.append('Video_Book', formData.Video_Book);
      formDataToSend.append('IsActive', formData.IsActive);
      if (formData.Audio_File) formDataToSend.append('Audio_File', formData.Audio_File);
      if (formData.Video_File) formDataToSend.append('Video_File', formData.Video_File);
      if (formData.E_Book_File) formDataToSend.append('E_Book_File', formData.E_Book_File);
  
      try {
        const response = await fetch('http://127.0.0.1:8000/api/booktypes/', {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Ensure CSRF token is included
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Book type created:', data);
          navigate('/employee/manage-booktype');
        } else {
          const errorData = await response.json();
          console.error('Failed to create book type:', errorData);
        }
      } catch (error) {
        console.error('Error submitting book type:', error);
      }
    }
  };
  
  // Helper function to get CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-add-book-type-container admin-add-product-container">
          <h1 className="admin-add-book-type-title admin-add-product-title">Add New Book Type</h1>
          <form onSubmit={handleSubmit} className="admin-add-book-type-form admin-add-product-form">
            <div className="form-group admin-add-product-description">
              <label htmlFor="Book_Name">Book Name</label>
              <input
                type="text"
                id="Book_Name"
                name="Book_Name"
                value={formData.Book_Name}
                onChange={handleChange}
                className="form-control"
                
              />
              {errors.Book_Name && <p className="error">*{errors.Book_Name}</p>}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Physical_Book">Physical Book</label>
              <select
                id="Physical_Book"
                name="Physical_Book"
                value={formData.Physical_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Audio_Book">Audio Book</label>
              <select
                id="Audio_Book"
                name="Audio_Book"
                value={formData.Audio_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.Audio_Book === '1' && (
                <>
                  <label htmlFor="Audio_File">Upload Audio File</label>
                  <input
                    type="file"
                    id="Audio_File"
                    name="Audio_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.Audio_File && <p className="error">{errors.Audio_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="Video_Book">Video Book</label>
              <select
                id="Video_Book"
                name="Video_Book"
                value={formData.Video_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.Video_Book === '1' && (
                <>
                  <label htmlFor="Video_File">Upload Video File</label>
                  <input
                    type="file"
                    id="Video_File"
                    name="Video_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.Video_File && <p className="error">{errors.Video_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-field">
              <label htmlFor="E_Book">E-Book</label>
              <select
                id="E_Book"
                name="E_Book"
                value={formData.E_Book}
                onChange={handleChange}
                className="form-control"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
              {formData.E_Book === '1' && (
                <>
                  <label htmlFor="E_Book_File">Upload E-Book File</label>
                  <input
                    type="file"
                    id="E_Book_File"
                    name="E_Book_File"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {errors.E_Book_File && <p className="error">{errors.E_Book_File}</p>}
                </>
              )}
            </div>

            <div className="form-group admin-add-product-description">
              <label htmlFor="IsActive">Is Active</label>
              <select
                id="IsActive"
                name="IsActive"
                value={formData.IsActive}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary admin-add-product-submit-btn">Add Book Type</button>
          </form>
        </div>
      </div>
    </div>
  );
}




export default EmployeeAddBookType
