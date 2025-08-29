'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Target,
  Settings,
  Edit3,
  Save,
  X,
  Camera,
  LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile || {});
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">X</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Xploar</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                Back to Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4">
              {profile?.personalInfo?.profilePicture ? (
                <img 
                  src={profile.personalInfo.profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{user.email}</p>
          
          <div className="flex justify-center space-x-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.personalInfo?.firstName || ''}
                      onChange={(e) => handleNestedChange('personalInfo', 'firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.personalInfo?.firstName || user.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.personalInfo?.lastName || ''}
                      onChange={(e) => handleNestedChange('personalInfo', 'lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.personalInfo?.lastName || user.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.personalInfo?.mobileNumber || ''}
                      onChange={(e) => handleNestedChange('personalInfo', 'mobileNumber', e.target.value)}
                      placeholder="Enter mobile number"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.personalInfo?.mobileNumber || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedProfile.personalInfo?.dateOfBirth || ''}
                      onChange={(e) => handleNestedChange('personalInfo', 'dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.personalInfo?.dateOfBirth || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <Select 
                      value={editedProfile.personalInfo?.gender || ''} 
                      onValueChange={(value) => handleNestedChange('personalInfo', 'gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{profile?.personalInfo?.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Education Level
                  </label>
                  {isEditing ? (
                    <Select 
                      value={editedProfile.academicInfo?.currentEducation || ''} 
                      onValueChange={(value) => handleNestedChange('academicInfo', 'currentEducation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                        <SelectItem value="UNDERGRADUATE">Undergraduate</SelectItem>
                        <SelectItem value="GRADUATE">Graduate</SelectItem>
                        <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                        <SelectItem value="WORKING_PROFESSIONAL">Working Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{profile?.academicInfo?.currentEducation || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.academicInfo?.fieldOfStudy || ''}
                      onChange={(e) => handleNestedChange('academicInfo', 'fieldOfStudy', e.target.value)}
                      placeholder="Enter field of study"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.academicInfo?.fieldOfStudy || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.academicInfo?.institution || ''}
                      onChange={(e) => handleNestedChange('academicInfo', 'institution', e.target.value)}
                      placeholder="Enter institution name"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.academicInfo?.institution || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedProfile.academicInfo?.graduationYear || ''}
                      onChange={(e) => handleNestedChange('academicInfo', 'graduationYear', parseInt(e.target.value))}
                      placeholder="Enter graduation year"
                      min="1950"
                      max="2030"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.academicInfo?.graduationYear || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Exam Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Exam
                  </label>
                  <p className="text-gray-900">{profile?.examInfo?.targetExam || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Year
                  </label>
                  <p className="text-gray-900">{profile?.examInfo?.examYear || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attempt Number
                  </label>
                  <p className="text-gray-900">{profile?.examInfo?.attemptNumber || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Rank
                  </label>
                  <p className="text-gray-900">{profile?.examInfo?.targetRank || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <span>Study Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Study Time
                  </label>
                  {isEditing ? (
                    <Select 
                      value={editedProfile.preferences?.studyPreferences?.preferredStudyTime || ''} 
                      onValueChange={(value) => handleNestedChange('preferences', 'studyPreferences', {
                        ...editedProfile.preferences?.studyPreferences,
                        preferredStudyTime: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING">Morning</SelectItem>
                        <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                        <SelectItem value="EVENING">Evening</SelectItem>
                        <SelectItem value="NIGHT">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{profile?.preferences?.studyPreferences?.preferredStudyTime || 'Not specified'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Duration (minutes)
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedProfile.preferences?.studyPreferences?.breakDuration || ''}
                      onChange={(e) => handleNestedChange('preferences', 'studyPreferences', {
                        ...editedProfile.preferences?.studyPreferences,
                        breakDuration: parseInt(e.target.value)
                      })}
                      placeholder="Enter break duration"
                      min="5"
                      max="60"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.preferences?.studyPreferences?.breakDuration || 'Not specified'} minutes</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Off Days
                  </label>
                  <p className="text-gray-900">
                    {profile?.preferences?.studyPreferences?.weeklyOffDays?.join(', ') || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Recommendations
                  </label>
                  <p className="text-gray-900">
                    {profile?.preferences?.studyPreferences?.aiRecommendations ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedProfile.preferences?.notificationSettings?.email || false}
                      onChange={(e) => handleNestedChange('preferences', 'notificationSettings', {
                        ...editedProfile.preferences?.notificationSettings,
                        email: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profile?.preferences?.notificationSettings?.email 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.preferences?.notificationSettings?.email ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedProfile.preferences?.notificationSettings?.sms || false}
                      onChange={(e) => handleNestedChange('preferences', 'notificationSettings', {
                        ...editedProfile.preferences?.notificationSettings,
                        sms: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profile?.preferences?.notificationSettings?.sms 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.preferences?.notificationSettings?.sms ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via push notifications</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedProfile.preferences?.notificationSettings?.push || false}
                      onChange={(e) => handleNestedChange('preferences', 'notificationSettings', {
                        ...editedProfile.preferences?.notificationSettings,
                        push: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profile?.preferences?.notificationSettings?.push 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.preferences?.notificationSettings?.push ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
