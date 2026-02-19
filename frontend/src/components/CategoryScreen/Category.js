import React, { useState,useEffect } from "react";
import "./Category.css";
import {Link} from 'react-router-dom';


function Category() {
  //Using useState concept
  const [categories,setCategories] = useState([])
  const baseUrl = "http://127.0.0.1:8000/api"
  const [totalResult, setTotalResults] = useState(0); //Pagination

  //Using useEffect concept
  useEffect(()=> {
    fetchData(baseUrl+'/category/')
  },[])

  function fetchData(baseurl) {
    fetch(baseurl)
      .then((response) => response.json())
      .then((data) => {
        const activeCategories = data.data.filter((category) => category.IsActive === "1");
        setCategories(activeCategories);
        setTotalResults(activeCategories.length);
      });
  }

  function changeUrl(baseurl){
    // setbaseurl(baseurl);
    fetchData(baseurl)
  }

  var links = [];  //creting links for pagination
  var limit = 1; //how many data to show on the pages
  var totalLinks = totalResult/limit;

  for(let i=1; i<=totalLinks; i++)
  {
    links.push(
    <li class="page-item">
      <Link onClick={()=> changeUrl(baseUrl+`/category/?page=${i}`)} to={`/category/?page=${i}`} class="page-link">{i}</Link>
    </li>)
  }


  return (
    <div className="category-page">
      <h1>Browse Our Book Categories</h1>
      <div className="category-grid">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className="category-card" key={category.Category_ID}>
              <Link to={`/category/${category.Category_Name}/${category.Category_ID}`}>
              <div className="card-inner">
                <div className="cat-card-front">
                  <img
                    src={category.Category_Photo}
                    alt={category.Category_Name}
                  />
                  <h3>{category.Category_Name}</h3>
                </div>
                <div className="cat-card-back">
                  <p>{category.Category_Description}</p>
                </div>
              </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>
      <ul className="pagination">{links}</ul>
    </div>
  );
}

export default Category;
