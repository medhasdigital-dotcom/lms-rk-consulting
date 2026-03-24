import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import LectureDrawer from './LectureDrawer';
import { GripVertical, Plus, Trash2, Edit2, ChevronDown, Video, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseEditor = () => {
  const { courseId } = useParams();
  
  // State
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [selectedLecture, setSelectedLecture] = useState(null); // For Drawer
  const [editingSectionId, setEditingSectionId] = useState(null); // Inline edit

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchEditorData();
  }, [courseId]);

  const fetchEditorData = async () => {
    try {
      const { data } = await courseService.getEditorData(courseId);
      setCourse(data.course);
      setSections(data.sections);
      setLectures(data.lectures);
    } catch (err) {
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  // 2. Section Handlers
  const handleAddSection = async () => {
    const title = "New Section";
    // Optimistic UI update could go here
    try {
      const { data: newSection } = await courseService.addSection(courseId, title);
      setSections([...sections, newSection]);
      setEditingSectionId(newSection._id); // Auto-focus edit mode
    } catch (err) {
      toast.error("Failed to add section");
    }
  };

  const handleUpdateSection = async (id, title) => {
    setEditingSectionId(null);
    if (!title.trim()) return;
    
    // Optimistic Update
    const oldSections = [...sections];
    setSections(sections.map(s => s._id === id ? { ...s, title } : s));

    try {
      await courseService.updateSection(id, { title });
    } catch (err) {
      setSections(oldSections); // Revert on fail
      toast.error("Save failed");
    }
  };

  const handleDeleteSection = async (id) => {
    if(!window.confirm("Delete section and all its lectures?")) return;
    try {
      await courseService.deleteSection(id);
      setSections(sections.filter(s => s._id !== id));
      setLectures(lectures.filter(l => l.sectionId !== id)); // Remove local lectures
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // 3. Lecture Handlers
  const handleAddLecture = async (sectionId) => {
    const title = "Untitled Lecture";
    try {
      const { data: newLecture } = await courseService.addLecture(sectionId, title, 'VIDEO');
      setLectures([...lectures, newLecture]);
      setSelectedLecture(newLecture); // Open Drawer immediately
    } catch (err) {
      toast.error("Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (e, id) => {
    e.stopPropagation();
    if(!window.confirm("Delete this lecture?")) return;
    try {
      await courseService.deleteLecture(id);
      setLectures(lectures.filter(l => l._id !== id));
      if (selectedLecture?._id === id) setSelectedLecture(null);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const onLectureUpdate = (updatedLecture) => {
    // Callback from Drawer to update list view
    setLectures(lectures.map(l => l._id === updatedLecture._id ? updatedLecture : l));
  };

  if (loading) return <div className="p-10 flex justify-center">Loading Course Editor...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* --- Main Content Area --- */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{course?.title}</h1>
            <p className="text-sm text-gray-500">Curriculum Manager</p>
          </div>
          <button 
            className={`px-4 py-2 rounded-lg font-medium ${course?.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => toast("Publish toggle logic here")}
          >
            {course?.isPublished ? 'Published' : 'Draft Mode'}
          </button>
        </header>

        <div className="max-w-4xl mx-auto py-10 px-6">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Course Content</h2>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Section Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    
                    {editingSectionId === section._id ? (
                      <input 
                        className="font-semibold text-gray-800 bg-white px-2 py-1 border rounded"
                        autoFocus
                        defaultValue={section.title}
                        onBlur={(e) => handleUpdateSection(section._id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateSection(section._id, e.currentTarget.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                         <span className="font-semibold text-gray-800">Section: {section.title}</span>
                         <button onClick={() => setEditingSectionId(section._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600">
                           <Edit2 className="w-4 h-4" />
                         </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDeleteSection(section._id)} className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleAddLecture(section._id)} className="p-2 text-gray-400 hover:text-blue-600 bg-white border rounded shadow-sm">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lectures List */}
                <div className="divide-y divide-gray-100">
                  {lectures
                    .filter(l => l.sectionId === section._id)
                    .map(lecture => (
                      <div 
                        key={lecture._id}
                        onClick={() => setSelectedLecture(lecture)}
                        className={`px-4 py-3 flex items-center gap-3 hover:bg-blue-50 cursor-pointer transition-colors ${selectedLecture?._id === lecture._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="p-2 bg-gray-100 rounded">
                           {lecture.lectureType === 'VIDEO' ? <Video className="w-4 h-4 text-gray-600" /> : <FileText className="w-4 h-4 text-gray-600" />}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{lecture.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${lecture.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {lecture.status === 'PUBLISHED' ? 'Ready' : 'Draft'}
                            </span>
                            {lecture.isFreePreview && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Free Preview</span>
                            )}
                          </div>
                        </div>

                        <button onClick={(e) => handleDeleteLecture(e, lecture._id)} className="p-2 text-gray-300 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  ))}
                  
                  {lectures.filter(l => l.sectionId === section._id).length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm italic">
                      No lectures yet. Click + to add one.
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddSection}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Section
            </button>
          </div>
        </div>
      </div>

      {/* --- Side Drawer (Lecture Editor) --- */}
      {selectedLecture && (
        <LectureDrawer 
          lecture={selectedLecture} 
          onClose={() => setSelectedLecture(null)}
          onUpdate={onLectureUpdate}
        />
      )}
    </div>
  );
};

export default CourseEditor;