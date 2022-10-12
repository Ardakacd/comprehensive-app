import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { default as ReactPagination } from "@mui/material/Pagination";

const Pagination = ({ result }) => {
  let [pageCount, setPageCount] = useState(Math.ceil(result / 10));

  useEffect(() => {
    setPageCount(Math.ceil(result / 10));
  }, [result, pageCount]);

  const handlePageClick = () => {
    console.log("Page changed");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "5rem",
      }}
    >
      <ReactPagination count={pageCount} color="primary" />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { result: state.products.result };
};

export default connect(mapStateToProps, null)(Pagination);
