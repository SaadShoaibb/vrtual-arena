'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

export default function HomepageEditor() {
    const [activeTab, setActiveTab] = useState('faqs');
    const [locale, setLocale] = useState('en');
    const [faqs, setFaqs] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [locale, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'faqs') {
                const res = await axios.get(`${API_URL}/admin/faqs?locale=${locale}`, getAuthHeaders());
                setFaqs(res.data.faqs || []);
            } else {
                const res = await axios.get(`${API_URL}/admin/testimonials?locale=${locale}`, getAuthHeaders());
                setTestimonials(res.data.testimonials || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleSave = async (item) => {
        try {
            if (activeTab === 'faqs') {
                if (item.id) {
                    await axios.put(`${API_URL}/admin/faqs/${item.id}`, item, getAuthHeaders());
                } else {
                    await axios.post(`${API_URL}/admin/faqs`, { ...item, locale }, getAuthHeaders());
                }
            } else {
                if (item.id) {
                    await axios.put(`${API_URL}/admin/testimonials/${item.id}`, item, getAuthHeaders());
                } else {
                    await axios.post(`${API_URL}/admin/testimonials`, { ...item, locale }, getAuthHeaders());
                }
            }
            setEditingItem(null);
            fetchData();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const endpoint = activeTab === 'faqs' ? 'faqs' : 'testimonials';
            await axios.delete(`${API_URL}/admin/${endpoint}/${id}`, getAuthHeaders());
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const renderFAQs = () => (
        <div className="space-y-4">
            {faqs.map((faq) => (
                <div key={faq.id} className="bg-white p-4 rounded shadow">
                    {editingItem?.id === faq.id ? (
                        <FAQForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
                    ) : (
                        <>
                            <h3 className="font-bold">{faq.question}</h3>
                            <p className="text-gray-600 mt-2">{faq.answer}</p>
                            <div className="mt-2 flex gap-2">
                                <button onClick={() => setEditingItem(faq)} className="text-blue-600">Edit</button>
                                <button onClick={() => handleDelete(faq.id)} className="text-red-600">Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
            {editingItem?.id === 'new' ? (
                <FAQForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
            ) : (
                <button onClick={() => setEditingItem({ id: 'new', question: '', answer: '', display_order: faqs.length + 1, is_active: true })} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add FAQ
                </button>
            )}
        </div>
    );

    const renderTestimonials = () => (
        <div className="space-y-4">
            {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-4 rounded shadow">
                    {editingItem?.id === testimonial.id ? (
                        <TestimonialForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
                    ) : (
                        <>
                            <h3 className="font-bold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                            <p className="text-gray-600 mt-2">{testimonial.feedback}</p>
                            <p className="text-yellow-500 mt-1">Rating: {testimonial.rating}/5</p>
                            <div className="mt-2 flex gap-2">
                                <button onClick={() => setEditingItem(testimonial)} className="text-blue-600">Edit</button>
                                <button onClick={() => handleDelete(testimonial.id)} className="text-red-600">Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
            {editingItem?.id === 'new' ? (
                <TestimonialForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
            ) : (
                <button onClick={() => setEditingItem({ id: 'new', name: '', role: 'Client Feedback', feedback: '', rating: 5, display_order: testimonials.length + 1, is_active: true })} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Testimonial
                </button>
            )}
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Homepage Content Editor</h1>
            
            <div className="mb-4 flex gap-4">
                <select value={locale} onChange={(e) => setLocale(e.target.value)} className="border px-4 py-2 rounded">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('faqs')} className={`px-4 py-2 rounded ${activeTab === 'faqs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        FAQs
                    </button>
                    <button onClick={() => setActiveTab('testimonials')} className={`px-4 py-2 rounded ${activeTab === 'testimonials' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        Testimonials
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : activeTab === 'faqs' ? renderFAQs() : renderTestimonials()}
        </div>
    );
}

function FAQForm({ item, onSave, onCancel }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="bg-gray-50 p-4 rounded">
            <input
                type="text"
                placeholder="Question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-2"
            />
            <textarea
                placeholder="Answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-2"
                rows="4"
            />
            <div className="flex gap-2">
                <button onClick={() => onSave(formData)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );
}

function TestimonialForm({ item, onSave, onCancel }) {
    const [formData, setFormData] = useState(item);

    return (
        <div className="bg-gray-50 p-4 rounded">
            <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-2"
            />
            <textarea
                placeholder="Feedback"
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-2"
                rows="4"
            />
            <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full border px-3 py-2 rounded mb-2"
            />
            <div className="flex gap-2">
                <button onClick={() => onSave(formData)} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );
}
