import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  LightBulbIcon,
  InformationCircleIcon,
  VideoCameraIcon,
  BookOpenIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const HelpSection = ({ title, icon: Icon, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div 
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-primary-500 mr-3" aria-hidden="true" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          aria-hidden="true"
        />
      </div>
      {isOpen && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full px-4 py-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900">{question}</span>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-gray-500">{answer}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-6 text-gray-900">Help Center</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <ArrowRightIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-base text-gray-500 max-w-3xl">
          Welcome to the AI Interview Assistant help center. Find answers to frequently asked questions, 
          learn how to prepare for interviews, and get support if needed.
        </p>
      </div>

      <div className="mt-8">
        <HelpSection title="Frequently Asked Questions" icon={QuestionMarkCircleIcon} initiallyOpen={true}>
          <div className="space-y-2">
            <FaqItem 
              question="How do AI interviews work?" 
              answer="AI interviews use advanced technology to simulate a real interview experience. Questions are presented on screen or via voice, and your responses are recorded and analyzed. You can respond by typing, speaking, or recording a video depending on the question type. The AI provides a standardized interview experience for all candidates."
            />
            <FaqItem 
              question="Is my data secure during interviews?" 
              answer="Yes, all data collected during interviews is encrypted and securely stored. Your personal information and responses are only accessible to the hiring team and comply with data privacy regulations. You can request deletion of your data at any time through the support team."
            />
            <FaqItem 
              question="What happens if I lose internet connection during an interview?" 
              answer="The system will automatically save your progress if your connection drops. You can resume the interview when your connection is restored by accessing the interview link again. If problems persist, contact support for assistance."
            />
            <FaqItem 
              question="Can I retake an interview if I'm not happy with my responses?" 
              answer="This depends on the settings chosen by the recruiter. Some interviews allow multiple attempts, while others are limited to a single try. Check the interview details before starting for information about allowed attempts."
            />
            <FaqItem 
              question="How are interviews evaluated?" 
              answer="Interviews are evaluated based on multiple factors, including the content of your responses, communication skills, and how well your answers align with the position requirements. For technical roles, problem-solving approach and accuracy are also considered. The AI provides an initial analysis, but final review is done by human recruiters."
            />
            <FaqItem 
              question="How long do I have to complete an interview?" 
              answer="The time limit varies depending on the interview type and recruiter settings. Most interviews specify a due date by which you must complete it. Within the interview itself, some questions may have individual time limits. These details are provided before you begin the interview."
            />
          </div>
        </HelpSection>
        
        <HelpSection title="Interview Preparation Tips" icon={LightBulbIcon}>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Before Your Interview</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Research the company and position thoroughly</li>
                <li>Test your equipment (camera, microphone, internet connection)</li>
                <li>Find a quiet, well-lit space with a neutral background</li>
                <li>Prepare examples of your experiences that demonstrate key skills</li>
                <li>Practice common interview questions out loud</li>
                <li>Review the job description and match your experience to requirements</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">During Your Interview</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Speak clearly and at a moderate pace</li>
                <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                <li>Be concise but thorough in your responses</li>
                <li>Maintain good posture and eye contact with the camera</li>
                <li>Take a moment to gather your thoughts before answering</li>
                <li>Show enthusiasm and positive energy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Technical Tips</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Use Chrome or Firefox browsers for best performance</li>
                <li>Close unnecessary applications and browser tabs</li>
                <li>Connect to a stable WiFi network</li>
                <li>Use headphones to improve audio quality</li>
                <li>Position your camera at eye level</li>
                <li>Save your progress regularly if the interview allows it</li>
              </ul>
            </div>
          </div>
        </HelpSection>
        
        <HelpSection title="How to Use the Platform" icon={InformationCircleIcon}>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Navigating Your Dashboard</h4>
              <p className="mt-2 text-sm text-gray-500">
                Your dashboard is your central hub for managing interviews. It displays upcoming interviews, 
                completed sessions, and important notifications. Use the sidebar navigation to access different sections:
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li><strong>Dashboard</strong>: Overview of your activity and key metrics</li>
                <li><strong>My Interviews</strong>: List of all interviews (pending, scheduled, in progress, completed)</li>
                <li><strong>Schedule</strong>: Timeline view of upcoming interview sessions</li>
                <li><strong>Help</strong>: Access to guides, FAQs, and support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Taking an Interview</h4>
              <ol className="mt-2 list-decimal pl-5 text-sm text-gray-500 space-y-1">
                <li>Find your interview in either the Dashboard or My Interviews section</li>
                <li>Click the "Start Interview" or "Continue Interview" button</li>
                <li>Read the instructions carefully before proceeding</li>
                <li>Grant permission for microphone/camera if prompted</li>
                <li>Answer each question within the allotted time (if applicable)</li>
                <li>Use the navigation controls to move between questions</li>
                <li>Submit your interview when complete</li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Reviewing Results</h4>
              <p className="mt-2 text-sm text-gray-500">
                After completing an interview and once the recruiter has reviewed it, you may receive feedback 
                and results. Access these by navigating to the completed interview in your My Interviews section 
                and clicking "View Results."
              </p>
            </div>
          </div>
        </HelpSection>
        
        <HelpSection title="Video Recording Tips" icon={VideoCameraIcon}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Many interviews include video response questions. Here are tips to ensure your video responses make the best impression:
            </p>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Setting</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Choose a quiet location with minimal background noise</li>
                <li>Ensure good lighting - natural light from in front is best</li>
                <li>Select a neutral, professional background</li>
                <li>Position yourself so you're centered in the frame</li>
                <li>Make sure your face is well-lit and clear</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Appearance</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Dress professionally as you would for an in-person interview</li>
                <li>Avoid clothing with small patterns or stripes (can cause visual distortion)</li>
                <li>Wear solid colors that contrast with your background</li>
                <li>Minimize distracting jewelry or accessories</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900">Delivery</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 space-y-1">
                <li>Look directly at the camera, not at yourself on the screen</li>
                <li>Speak clearly and at a moderate pace</li>
                <li>Use hand gestures naturally but avoid excessive movement</li>
                <li>Maintain good posture - sit up straight</li>
                <li>Show enthusiasm through facial expressions and voice tone</li>
                <li>Practice recording yourself beforehand to get comfortable</li>
              </ul>
            </div>
          </div>
        </HelpSection>
        
        <HelpSection title="Resources" icon={BookOpenIcon}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900">Interview Guides</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Common Behavioral Interview Questions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    The STAR Method Explained
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    How to Answer "Tell Me About Yourself"
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Answering Difficult Interview Questions
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900">Technical Preparation</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Technical Interview Checklist
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Problem-Solving Strategies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Coding Interview Best Practices
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    System Design Interview Guide
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900">Career Development</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Resume Building Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    LinkedIn Profile Optimization
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Negotiating Job Offers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Career Advancement Strategies
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900">Industry Insights</h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Current Tech Industry Trends
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Top Skills in Demand for 2023
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Remote Work Best Practices
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Future of Work Report
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </HelpSection>
        
        <HelpSection title="Contact Support" icon={ChatBubbleLeftRightIcon}>
          <div className="max-w-lg">
            <p className="text-sm text-gray-500 mb-6">
              Need additional help? Our support team is available to assist you with any questions 
              or technical issues you may encounter.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Support</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    For general inquiries and non-urgent issues:
                    <a href="mailto:support@aiinterviewassistant.com" className="ml-1 text-primary-600 hover:text-primary-800">
                      support@aiinterviewassistant.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Live Chat</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Available Monday-Friday, 9am-5pm EST for immediate assistance
                  </p>
                  <button 
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-primary-500 text-xs font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
                  >
                    Start Live Chat
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Submit a Support Ticket</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    For technical issues or complex questions that require follow-up
                  </p>
                  <button 
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-primary-500 text-xs font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
                  >
                    Create Support Ticket
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    For urgent issues related to scheduled interviews happening within 24 hours, 
                    please contact us immediately via Live Chat or call (555) 123-4567.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </HelpSection>
      </div>
    </div>
  );
};

export default Help; 