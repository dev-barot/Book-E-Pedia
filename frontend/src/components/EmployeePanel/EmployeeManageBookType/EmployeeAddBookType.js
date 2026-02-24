import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeAddBookType.css";

function EmployeeAddBookType() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookToEdit = location.state?.book;

  // ✅ ID Generation (Frontend)
  const [nextBookId, setNextBookId] = useState(() => {
    const storedId = parseInt(localStorage.getItem("nextBookId"), 10);
    return isNaN(storedId) ? 1 : storedId;
  });

  useEffect(() => {
    if (!localStorage.getItem("nextBookId")) {
      localStorage.setItem("nextBookId", "1");
    }
  }, []);

  const generateBookId = () => {
    const newId = nextBookId + 1;
    localStorage.setItem("nextBookId", newId);
    setNextBookId(newId);
    return nextBookId;
  };

  const [formData, setFormData] = useState({
    Book_Name: bookToEdit ? bookToEdit.Book_Name : "",
    Physical_Book: "0",
    Audio_Book: "0",
    E_Book: "0",
    Video_Book: "0",
    Audio_File: null,
    Video_File: null,
    E_Book_File: null,
    IsActive: "1",
  });

  const [errors, setErrors] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.Book_Name) {
      formErrors.Book_Name = "Please enter Book Name";
    }

    if (formData.Audio_Book === "1" && !formData.Audio_File) {
      formErrors.Audio_File = "Audio file is required";
    }

    if (formData.Video_Book === "1" && !formData.Video_File) {
      formErrors.Video_File = "Video file is required";
    }

    if (formData.E_Book === "1" && !formData.E_Book_File) {
      formErrors.E_Book_File = "E-book file is required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const bookTypes =
        JSON.parse(localStorage.getItem("bookTypes")) || [];

      const newBookType = {
        id: generateBookId(),
        ...formData,
        Audio_File: formData.Audio_File
          ? formData.Audio_File.name
          : null,
        Video_File: formData.Video_File
          ? formData.Video_File.name
          : null,
        E_Book_File: formData.E_Book_File
          ? formData.E_Book_File.name
          : null,
      };

      bookTypes.push(newBookType);

      localStorage.setItem(
        "bookTypes",
        JSON.stringify(bookTypes)
      );

      alert("Book Type Added Successfully ✅");

      navigate("/employee/manage-booktype");
    }
  };

  return (
    <div
      className={`dashboard-main-container ${
        isSidebarCollapsed ? "collapsed" : ""
      }`}
    >
      <div
        className={`top-main-dashboard-navbar ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div
        className={`sidebar-main-section ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div
        className={`dashboard-main-content ${
          isSidebarCollapsed ? "expanded" : ""
        }`}
      >
        <div className="admin-add-book-type-container admin-add-product-container">
          <h1 className="admin-add-book-type-title admin-add-product-title">
            Add New Book Type
          </h1>

          <form
            onSubmit={handleSubmit}
            className="admin-add-book-type-form admin-add-product-form"
          >
            <div className="form-group">
              <label>Book Name</label>
              <input
                type="text"
                name="Book_Name"
                value={formData.Book_Name}
                onChange={handleChange}
                className="form-control"
              />
              {errors.Book_Name && (
                <p className="error">*{errors.Book_Name}</p>
              )}
            </div>

            {["Physical_Book", "Audio_Book", "Video_Book", "E_Book"].map(
              (type) => (
                <div className="form-group" key={type}>
                  <label>{type.replace("_", " ")}</label>
                  <select
                    name={type}
                    value={formData[type]}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>

                  {formData[type] === "1" &&
                    type !== "Physical_Book" && (
                      <>
                        <label>
                          Upload {type.replace("_", " ")} File
                        </label>
                        <input
                          type="file"
                          name={`${type.split("_")[0]}_File`}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {errors[`${type.split("_")[0]}_File`] && (
                          <p className="error">
                            {
                              errors[
                                `${type.split("_")[0]}_File`
                              ]
                            }
                          </p>
                        )}
                      </>
                    )}
                </div>
              )
            )}

            <div className="form-group">
              <label>Is Active</label>
              <select
                name="IsActive"
                value={formData.IsActive}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary admin-add-product-submit-btn"
            >
              Add Book Type
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAddBookType;
