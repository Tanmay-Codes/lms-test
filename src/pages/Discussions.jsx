import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Discussions() {
  const [discussions] = useState([
    {
      id: 1,
      title: 'Introduction to Music Theory',
      author: 'Jane Smith',
      date: '2023-05-15T10:30:00Z',
      replies: 8,
      views: 42,
    },
    {
      id: 2,
      title: 'Tips for Piano Practice',
      author: 'Michael Johnson',
      date: '2023-05-12T14:15:00Z',
      replies: 12,
      views: 76,
    },
    {
      id: 3,
      title: 'Song Recommendations for Beginners',
      author: 'Emily Davis',
      date: '2023-05-10T09:45:00Z',
      replies: 15,
      views: 103,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Discussions</h1>
          <p className="text-muted-foreground">Join the conversation with other students and teachers</p>
        </div>
        <Button>New Topic</Button>
      </div>
      
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="hover:bg-accent/10 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{discussion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  Posted by {discussion.author} on {new Date(discussion.date).toLocaleDateString()}
                </div>
                <div className="flex space-x-4">
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.views} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 