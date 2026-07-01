import { useState } from "react";
import { Document, Page } from "react-pdf";

import "./SecurePdfViewer.css";

export default function SecurePdfViewer({
  fileUrl,
}) {
  const [numPages, setNumPages] =
    useState(null);

  const [pageNumber, setPageNumber] =
    useState(1);

  const [scale, setScale] =
    useState(1.2);

  function onDocumentLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  function previousPage() {
    setPageNumber((page) =>
      Math.max(page - 1, 1)
    );
  }

  function nextPage() {
    setPageNumber((page) =>
      Math.min(page + 1, numPages)
    );
  }

  function zoomIn() {
    setScale((s) =>
      Math.min(s + 0.2, 3)
    );
  }

  function zoomOut() {
    setScale((s) =>
      Math.max(s - 0.2, 0.6)
    );
  }

  return (
    <div className="pdf-viewer">

      <div className="pdf-toolbar">

        <button
          className="btn-primary"
          onClick={previousPage}
          disabled={pageNumber === 1}
        >
          Previous
        </button>

        <span>

          Page {pageNumber}

          {numPages &&
            ` / ${numPages}`}

        </span>

        <button
          className="btn-primary"
          onClick={nextPage}
          disabled={
            pageNumber === numPages
          }
        >
          Next
        </button>

        <button
          className="btn-primary"
          onClick={zoomOut}
        >
          −
        </button>

        <button
          className="btn-primary"
          onClick={zoomIn}
        >
          +
        </button>

      </div>

      <div className="pdf-container">

        <Document
          file={fileUrl}
          onLoadSuccess={
            onDocumentLoadSuccess
          }
          loading="Loading PDF..."
          error="Unable to load PDF."
        >

          <Page
            pageNumber={pageNumber}
            scale={scale}
          />

        </Document>

      </div>

    </div>
  );
}