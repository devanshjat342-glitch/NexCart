function Hero() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

        {/* Left Side */}
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold leading-tight">
            Shop Smart with <span className="text-blue-600">NexCart</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Discover the latest fashion, electronics, shoes,
            accessories, and much more at the best prices.
          </p>

          <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Explore Products
          </button>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
            alt="Shopping"
            className="rounded-xl shadow-lg w-[450px]"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;