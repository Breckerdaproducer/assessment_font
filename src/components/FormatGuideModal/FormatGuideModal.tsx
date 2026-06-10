'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface FormatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormatGuideModal({ isOpen, onClose }: FormatGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Question Format Guidelines</h2>
            <p className="text-blue-100 text-sm mt-1">Please follow this format for PDF uploads</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-slate-700">
              <strong>✓ Follow this exact format for each question in your PDF:</strong>
            </p>
          </div>

          <div className="bg-slate-100 p-6 rounded-lg mb-8 font-mono text-sm border border-slate-300">
            <div className="text-slate-800 space-y-2">
              <div><span className="font-bold">1. What does HTML stand for?</span></div>
              <div className="ml-4">A. Hyper Text Markup Language</div>
              <div className="ml-4">B. High Text Machine Language</div>
              <div className="ml-4">C. Home Tool Markup Language</div>
              <div className="ml-4">D. Hyperlinks and Text Markup Language</div>
              <div className="text-green-700 font-bold mt-2">Answer: A</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Question Number & Text</p>
                <p className="text-slate-600 text-sm">Start with a number, followed by the question text</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Options Format</p>
                <p className="text-slate-600 text-sm">Use A, B, C, D (or E, F, etc.) followed by a period, then the option text</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Correct Answer Line</p>
                <p className="text-slate-600 text-sm">Add "Answer: X" on a new line (where X is the correct option letter)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Spacing</p>
                <p className="text-slate-600 text-sm">Leave a blank line between questions to ensure proper separation</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            <p><strong>⚠ Important:</strong> PDFs that don't follow this format may not be processed correctly. Please ensure all questions follow the format shown above.</p>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
            >
              Got it, Let's Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
