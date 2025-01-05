"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface EmailItem {
  subject: string;
  image: string;
  vertical: string;
  category: string;
}

export default function EmailPage() {
  const [emailData, setEmailData] = useState<EmailItem[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVertical, setSelectedVertical] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setEmailData(data);
        setFilteredEmails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = emailData;

    // if (searchTerm) {
    //   result = result.filter((email) =>
    //     email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    // }

    if (searchTerm) {
      const terms = searchTerm.toLowerCase().split(" ");
      result = result.filter((email) =>
        terms.some((term) => email.subject.toLowerCase().includes(term))
      );
    }

    if (selectedVertical) {
      result = result.filter((email) => email.vertical === selectedVertical);
    }

    if (selectedCategory) {
      result = result.filter((email) => email.category === selectedCategory);
    }

    setFilteredEmails(result);
  }, [searchTerm, selectedVertical, selectedCategory, emailData]);

  const verticals = [...new Set(emailData.map((item) => item.vertical))].sort();
  const categories = [
    ...new Set(emailData.map((item) => item.category)),
  ].sort();

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedVertical("");
    setSelectedCategory("");
  };

  const openModal = (email: EmailItem) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedEmail(null);
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">
          Email Gallery
        </h1>

        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by subject"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] text-gray-700 bg-white font-medium"
          >
            <option value="">All Verticals</option>
            {verticals.map((vertical) => (
              <option key={vertical} value={vertical} className="text-gray-700">
                {vertical}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] text-gray-700 bg-white font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="text-gray-700">
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium"
          >
            Clear Filters
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          Showing {filteredEmails.length} of {emailData.length} emails
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmails.map((email, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => openModal(email)}
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={email.image}
                    alt={email.subject}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 6}
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 font-display">
                    {email.subject}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      {email.vertical}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                      {email.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-display">
              No emails found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {isModalOpen && selectedEmail && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 bg-black/80 text-white">
              <h2 className="text-xl font-semibold font-display">
                {selectedEmail.subject}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              <div className="flex-1 bg-black flex items-center justify-center p-4">
                <div className="relative h-full w-full">
                  <Image
                    src={selectedEmail.image}
                    alt={selectedEmail.subject}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/api/placeholder/800/600";
                    }}
                  />
                </div>
              </div>

              <div className="w-80 bg-white p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">
                      {selectedEmail.subject}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {selectedEmail.vertical}
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        {selectedEmail.category}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2 font-display">
                      Additional Details
                    </h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Category</dt>
                        <dd className="text-gray-900">
                          {selectedEmail.category}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Vertical</dt>
                        <dd className="text-gray-900">
                          {selectedEmail.vertical}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
