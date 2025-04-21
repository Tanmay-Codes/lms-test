import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileText, Book, Video, Download, Search } from 'lucide-react';

export function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceType, setResourceType] = useState('all');
  
  const [resources] = useState([
    {
      id: 1,
      title: 'Music Theory Basics',
      description: 'A comprehensive guide to music theory fundamentals.',
      type: 'document',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      addedOn: '2023-05-15',
      downloadCount: 128,
    },
    {
      id: 2,
      title: 'Piano Finger Exercises',
      description: 'Essential exercises for improving finger dexterity and technique.',
      type: 'document',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      addedOn: '2023-04-22',
      downloadCount: 95,
    },
    {
      id: 3,
      title: 'Intro to Reading Sheet Music',
      description: 'Video tutorial on how to read sheet music for beginners.',
      type: 'video',
      duration: '18:42',
      addedOn: '2023-06-10',
      viewCount: 215,
    },
    {
      id: 4,
      title: 'Beginner Guitar Chords',
      description: 'Learn the most common guitar chords for beginners.',
      type: 'document',
      fileSize: '3.2 MB',
      fileType: 'PDF',
      addedOn: '2023-03-18',
      downloadCount: 187,
    },
    {
      id: 5,
      title: 'Music History: Classical Period',
      description: 'An overview of the Classical period in music history.',
      type: 'ebook',
      fileSize: '5.7 MB',
      fileType: 'EPUB',
      addedOn: '2023-02-28',
      downloadCount: 76,
    },
    {
      id: 6,
      title: 'Advanced Piano Techniques',
      description: 'Video masterclass on advanced piano playing techniques.',
      type: 'video',
      duration: '42:15',
      addedOn: '2023-05-05',
      viewCount: 142,
    },
  ]);
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = resourceType === 'all' || resource.type === resourceType;
    
    return matchesSearch && matchesType;
  });
  
  const getResourceIcon = (type) => {
    switch(type) {
      case 'document': return <FileText className="h-10 w-10 text-blue-500" />;
      case 'ebook': return <Book className="h-10 w-10 text-green-500" />;
      case 'video': return <Video className="h-10 w-10 text-red-500" />;
      default: return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">Browse educational materials to support your learning</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10"
            placeholder="Search resources..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={resourceType === 'all' ? 'default' : 'outline'}
            onClick={() => setResourceType('all')}
          >
            All
          </Button>
          <Button 
            variant={resourceType === 'document' ? 'default' : 'outline'}
            onClick={() => setResourceType('document')}
          >
            Documents
          </Button>
          <Button 
            variant={resourceType === 'ebook' ? 'default' : 'outline'}
            onClick={() => setResourceType('ebook')}
          >
            E-Books
          </Button>
          <Button 
            variant={resourceType === 'video' ? 'default' : 'outline'}
            onClick={() => setResourceType('video')}
          >
            Videos
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No resources match your search criteria.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredResources.map(resource => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {getResourceIcon(resource.type)}
                    <div>
                      <p>{resource.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{resource.type}</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    {resource.type === 'video' ? (
                      <p>Duration: {resource.duration}</p>
                    ) : (
                      <p>{resource.fileSize} • {resource.fileType}</p>
                    )}
                  </div>
                  <div>
                    {resource.type === 'video' ? (
                      <p>{resource.viewCount} views</p>
                    ) : (
                      <p>{resource.downloadCount} downloads</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full flex gap-2 items-center">
                    {resource.type === 'video' ? (
                      <>
                        <Video className="h-4 w-4" />
                        <span>Watch Now</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 