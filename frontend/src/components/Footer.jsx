
const Footer = () => {
  return (
    <footer className="py-12 px-4 md:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-primary">Prescripto</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider uppercase">COMPANY</h3>
          <nav className="flex flex-col space-y-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About us
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Delivery
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy policy
            </a>
          </nav>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider uppercase">GET IN TOUCH</h3>
          <div className="space-y-2">
            <p className="text-muted-foreground">+0-000-000-000</p>
            <a 
              href="mailto:mhuzaifa3737@gmail.com" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              mhuzaifa3737@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          Copyright 2024 © Muhammad Huzaifa - All Right Reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer