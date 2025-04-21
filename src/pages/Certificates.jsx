import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download } from 'lucide-react';

export function Certificates() {
  const [certificates] = useState([
    {
      id: 1,
      title: 'Introduction to Piano',
      issueDate: '2023-04-15',
      instructor: 'Dr. John Adams',
      thumbnail: 'https://placehold.co/300x200/e6e6e6/333?text=Piano+Certificate'
    },
    {
      id: 2,
      title: 'Music Theory Fundamentals',
      issueDate: '2023-02-22',
      instructor: 'Prof. Lisa Wang',
      thumbnail: 'https://placehold.co/300x200/e6e6e6/333?text=Theory+Certificate'
    },
    {
      id: 3,
      title: 'Beginner Guitar',
      issueDate: '2022-11-10',
      instructor: 'James Miller',
      thumbnail: 'https://placehold.co/300x200/e6e6e6/333?text=Guitar+Certificate'
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Certificates</h1>
        <p className="text-muted-foreground">Achievements from your completed courses</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">You haven't earned any certificates yet.</p>
              <p className="text-muted-foreground">Complete a course to receive your first certificate.</p>
            </CardContent>
          </Card>
        ) : (
          certificates.map(certificate => (
            <Card key={certificate.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={certificate.thumbnail} 
                  alt={certificate.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{certificate.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                    <p>Instructor: {certificate.instructor}</p>
                  </div>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download Certificate</span>
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