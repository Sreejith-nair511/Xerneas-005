"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Upload, Search, Filter, Calendar, User, FileSearch } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Health record structure
interface HealthRecord {
  id: string
  title: string
  type: 'blood-test' | 'ecg' | 'prescription' | 'scan' | 'vaccination' | 'other'
  date: string
  description: string
  fileName?: string
  fileSize?: string
  uploadedBy: string
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      title: "Complete Blood Count",
      type: "blood-test",
      date: "2023-04-15",
      description: "Routine annual blood test",
      fileName: "cbc-results.pdf",
      fileSize: "2.4 MB",
      uploadedBy: "Dr. Sharma"
    },
    {
      id: "2",
      title: "ECG Report",
      type: "ecg",
      date: "2023-03-22",
      description: "Cardiac health assessment",
      fileName: "ecg-report.pdf",
      fileSize: "1.8 MB",
      uploadedBy: "Cardiology Clinic"
    },
    {
      id: "3",
      title: "Prescription - Hypertension",
      type: "prescription",
      date: "2023-05-01",
      description: "Blood pressure medication",
      fileName: "bp-prescription.pdf",
      fileSize: "0.9 MB",
      uploadedBy: "Dr. Patel"
    },
    {
      id: "4",
      title: "Chest X-Ray",
      type: "scan",
      date: "2023-02-10",
      description: "Routine checkup",
      fileName: "chest-xray.pdf",
      fileSize: "3.2 MB",
      uploadedBy: "Radiology Center"
    },
    {
      id: "5",
      title: "COVID-19 Vaccination",
      type: "vaccination",
      date: "2023-01-15",
      description: "Booster dose certificate",
      fileName: "covid-certificate.pdf",
      fileSize: "1.1 MB",
      uploadedBy: "Government Health Center"
    }
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "blood-test" as 'blood-test' | 'ecg' | 'prescription' | 'scan' | 'vaccination' | 'other',
    date: new Date().toISOString().split('T')[0],
    description: "",
    fileName: "",
    fileSize: "",
    uploadedBy: "Self"
  })

  // Filter records based on search and filter
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || record.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleAddRecord = () => {
    if (!newRecord.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the record",
        variant: "destructive",
      })
      return
    }

    const record: HealthRecord = {
      id: Date.now().toString(),
      ...newRecord,
    }

    setRecords([...records, record])
    setNewRecord({
      title: "",
      type: "blood-test",
      date: new Date().toISOString().split('T')[0],
      description: "",
      fileName: "",
      fileSize: "",
      uploadedBy: "Self"
    })
    setIsDialogOpen(false)
    
    toast({
      title: "Record Added",
      description: `${record.title} has been added to your health vault`,
    })
  }

  const handleDeleteRecord = (id: string) => {
    const record = records.find(r => r.id === id)
    if (record) {
      setRecords(records.filter(r => r.id !== id))
      toast({
        title: "Record Removed",
        description: `${record.title} has been removed from your vault`,
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a server
      // For simulation, we'll just store the file info
      setNewRecord({
        ...newRecord,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      })
      
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be added to your record`,
      })
    }
  }

  // Get icon for record type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood-test': return '🩸'
      case 'ecg': return '❤️'
      case 'prescription': return '💊'
      case 'scan': return '📸'
      case 'vaccination': return '💉'
      case 'other': return '📋'
      default: return '📄'
    }
  }

  // Get label for record type
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blood-test': return 'Blood Test'
      case 'ecg': return 'ECG'
      case 'prescription': return 'Prescription'
      case 'scan': return 'Scan/Image'
      case 'vaccination': return 'Vaccination'
      case 'other': return 'Other'
      default: return 'Document'
    }
  }

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Health Record Vault</h1>
          <p className="tadashi-tagline">
            Securely store and manage your important health documents
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search and Filter Bar */}
          <Card className="tadashi-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search records..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="blood-test">Blood Test</SelectItem>
                      <SelectItem value="ecg">ECG</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="scan">Scan/Image</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="tadashi-button">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle>Add New Health Record</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newRecord.title}
                          onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                          className="col-span-3"
                          placeholder="e.g., Blood Test Results"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select
                          value={newRecord.type}
                          onValueChange={(value) => setNewRecord({...newRecord, type: value as any})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blood-test">Blood Test</SelectItem>
                            <SelectItem value="ecg">ECG</SelectItem>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="scan">Scan/Image</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newRecord.date}
                          onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          value={newRecord.description}
                          onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                          className="col-span-3"
                          placeholder="Brief description"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="uploadedBy" className="text-right">
                          Uploaded By
                        </Label>
                        <Input
                          id="uploadedBy"
                          value={newRecord.uploadedBy}
                          onChange={(e) => setNewRecord({...newRecord, uploadedBy: e.target.value})}
                          className="col-span-3"
                          placeholder="e.g., Dr. Smith"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                          File
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="file"
                            type="file"
                            onChange={handleFileUpload}
                            className="w-full"
                          />
                          {newRecord.fileName && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {newRecord.fileName} ({newRecord.fileSize})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="tadashi-button"
                        onClick={handleAddRecord}
                      >
                        Add Record
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          {filteredRecords.length === 0 ? (
            <Card className="tadashi-card">
              <CardContent className="py-12 text-center">
                <FileSearch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No records found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || filterType !== "all" 
                    ? "Try adjusting your search or filter" 
                    : "Add your first health record to get started"}
                </p>
                <Button 
                  className="tadashi-button"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Your First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="tadashi-card hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center">
                        <span className="text-2xl mr-2">{getTypeIcon(record.type)}</span>
                        <span>{record.title}</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {record.date}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-2" />
                        {getTypeLabel(record.type)}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4 mr-2" />
                        {record.uploadedBy}
                      </div>
                      {record.fileName && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="font-medium">File:</p>
                          <p className="truncate">{record.fileName}</p>
                          <p className="text-gray-500 dark:text-gray-400">{record.fileSize}</p>
                        </div>
                      )}
                      {record.description && (
                        <div className="pt-2">
                          <p className="font-medium">Description:</p>
                          <p className="text-gray-700 dark:text-gray-300">{record.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Security Notice */}
          <Card className="tadashi-card mt-6">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-tadashi-blue/10 dark:bg-tadashi-blue/20 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-tadashi-blue" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Secure Storage</h3>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      Your health records are stored securely on your device. In a production environment, 
                      these would be encrypted and stored in a secure cloud environment with HIPAA compliance.
                    </p>
                    <p className="mt-1">
                      <strong>Note:</strong> This is a simulation. In a real application, files would be 
                      uploaded to secure servers with end-to-end encryption.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}