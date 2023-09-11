import React from "react";

const Landing = () => {
  return (
    <div className="py-6">
      <section className="bg-slate-600 h-48 rounded-md mb-6 flex items-center justify-center text-white">
        Banner
      </section>
      <section>
        <p className="text-center font-semibold text-2xl mb-6">
          Latest Products
        </p>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)]
            .map((_, index) => index + 1)
            .map((item) => (
              <div
                key={item}
                className="h-80 border border-gray-200 rounded-md flex items-center justify-center"
              >
                Product {item}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
