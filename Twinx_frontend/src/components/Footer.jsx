export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <p>Copyright © {new Date().getFullYear()} Data TwinX. All rights reserved.</p>
      <div className="social-links">
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://x.com" target="_blank" rel="noreferrer">
          X
        </a>
        <a href="mailto:datatwinx@example.com">Email</a>
      </div>
    </footer>
  );
}

