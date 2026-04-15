const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gradient">Send Smart</span>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Send Smart. Gmail AI auto-reply extension.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
