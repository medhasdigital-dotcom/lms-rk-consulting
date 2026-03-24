import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  MessageSquareQuote,
  GripVertical,
} from "lucide-react";

const emptyForm = {
  name: "",
  role: "",
  imageUrl: "",
  rating: 5,
  feedback: "",
};

const ManageTestimonials = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/v1/testimonials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) fetchTestimonials();
    else setLoading(false);
  }, [isEducator]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (testimonial) => {
    setEditingId(testimonial._id);
    setForm({
      name: testimonial.name,
      role: testimonial.role || "",
      imageUrl: testimonial.imageUrl || "",
      rating: testimonial.rating,
      feedback: testimonial.feedback,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.feedback.trim()) {
      toast.error("Name and feedback are required");
      return;
    }
    try {
      setSubmitting(true);
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        const { data } = await axios.put(
          `${backendUrl}/api/v1/testimonials/${editingId}`,
          form,
          { headers }
        );
        if (data.success) {
          toast.success("Testimonial updated");
          setTestimonials((prev) =>
            prev.map((t) => (t._id === editingId ? data.testimonial : t))
          );
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/v1/testimonials`,
          form,
          { headers }
        );
        if (data.success) {
          toast.success("Testimonial created");
          setTestimonials((prev) => [...prev, data.testimonial]);
        }
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${backendUrl}/api/v1/testimonials/${id}`,
        { isActive: !currentActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? data.testimonial : t))
        );
        toast.success(
          currentActive ? "Testimonial hidden from site" : "Testimonial visible on site"
        );
      }
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial permanently?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/v1/testimonials/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
        toast.success("Testimonial deleted");
      }
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquareQuote className="w-7 h-7 text-indigo-600" />
              Manage Testimonials
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Add and manage student testimonials shown on your landing page
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
            <p className="text-sm text-gray-500">Total Testimonials</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-2xl font-bold text-green-600">
              {testimonials.filter((t) => t.isActive).length}
            </p>
            <p className="text-sm text-gray-500">Visible on Site</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-2xl font-bold text-yellow-600">
              {testimonials.length > 0
                ? (
                    testimonials.reduce((s, t) => s + t.rating, 0) /
                    testimonials.length
                  ).toFixed(1)
                : "0.0"}
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
        </div>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
            <MessageSquareQuote className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No testimonials yet
            </h3>
            <p className="text-gray-400 mb-6">
              Add your first testimonial to showcase on your landing page
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              Add First Testimonial
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  testimonial.isActive
                    ? "border-gray-100"
                    : "border-dashed border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Drag handle placeholder */}
                  <div className="pt-1 text-gray-300 cursor-grab hidden sm:block">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {testimonial.imageUrl ? (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-lg">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      {!testimonial.isActive && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                    {testimonial.role && (
                      <p className="text-sm text-gray-500 mb-2">
                        {testimonial.role}
                      </p>
                    )}
                    <StarRating value={testimonial.rating} readonly />
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {testimonial.feedback}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() =>
                        toggleActive(testimonial._id, testimonial.isActive)
                      }
                      className={`p-2 rounded-lg transition ${
                        testimonial.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={
                        testimonial.isActive
                          ? "Hide from site"
                          : "Show on site"
                      }
                    >
                      {testimonial.isActive ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(testimonial)}
                      className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  required
                  maxLength={100}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  placeholder="e.g. Software Engineer @ Google"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  maxLength={150}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                />
                {form.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  value={form.rating}
                  onChange={(val) => setForm({ ...form, rating: val })}
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.feedback}
                  onChange={(e) =>
                    setForm({ ...form, feedback: e.target.value })
                  }
                  placeholder="What did the student say about your course?"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm resize-none"
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {form.feedback.length}/1000
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
