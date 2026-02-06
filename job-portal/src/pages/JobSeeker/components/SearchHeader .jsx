import { MapPin, Search } from "lucide-react";
//import { useState } from "react";

const SearchHeader = ({ filters, handleFilterChange }) => {
  //const [searching, setSearching]= useState(false)
  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl
     shadow-gray-200 border border-white/20 p-4 lg:p-8 mb-6 lg:mb-0">
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="text-center lg:text-left">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">Find your distinguish dream job here</h1>
          <p className="text-sm text-gray-600 lg:text-base">Discover opportunities that matches your potential</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute w-5 h-5 text-gray-400 left-4 top-1/2
             transform -translate-y-1/2 z-[1]"
             />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-2 lg:py-2.5 border
               border-gray-200 rounded-xl
                lg:rounded-xl outline-none text-base bg-white/50 backdrop-blur-sm focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
              placeholder="Search jobs base on titles, companys, or keywords"
            />
          </div>
          {/* Location */}
          <div className=" relative min-w-0 lg:min-w-[200px]">
            <MapPin className="absolute w-5 h-5 text-gray-400 left-4 top-1/2
             transform -translate-y-1/2 z-[1]"/>
            <input type="text"
            className="w-full pl-12 pr-4 py-2 lg:py-2.5 border
               border-gray-200 rounded-xl
                lg:rounded-xl outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base bg-white/50 backdrop-blur-sm"
            value={filters.location}
            placeholder="Search base on location"
            onChange={(e)=>handleFilterChange("location", e.target.value)}
             />
          </div>

          {/* Btn */}
          <button
          type="submit"
           className="bg-gradient-to-r from-blue-600 to-blue-700
            text-white px-6 lg:px-10 py-3 lg:py-2.5 
           rounded-xl lg:rounded-xl hover:from-blue-600
            hover:to-blue-700 transition-all
             font-semibold duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >

           Search Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
