export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using Xploar, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-6">
              Permission is granted to temporarily download one copy of the materials (information or software) on Xploar's website for personal, non-commercial transitory viewing only.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              The materials on Xploar's website are provided on an 'as is' basis. Xploar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
            <p className="text-gray-700 mb-6">
              In no event shall Xploar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Xploar's website.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Revisions and Errata</h2>
            <p className="text-gray-700 mb-6">
              The materials appearing on Xploar's website could include technical, typographical, or photographic errors. Xploar does not warrant that any of the materials on its website are accurate, complete or current.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Links</h2>
            <p className="text-gray-700 mb-6">
              Xploar has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Xploar of the site.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Site Terms of Use Modifications</h2>
            <p className="text-gray-700 mb-6">
              Xploar may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              Any claim relating to Xploar's website shall be governed by the laws of the State of India without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
