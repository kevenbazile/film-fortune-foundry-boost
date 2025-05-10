
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Film {
  id: number;
  title: string;
  director: string;
  duration: string;
  thumbnail: string;
  revenue: string;
  platforms: string[];
  genre: string;
}

interface FilmCardProps {
  film: Film;
}

const FilmCard = ({ film }: FilmCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <img
          src={film.thumbnail}
          alt={film.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-medium">
            {film.genre}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-bold mb-1">{film.title}</h3>
        <p className="text-muted-foreground mb-4">
          Directed by {film.director} • {film.duration}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {film.platforms.map((platform, idx) => (
            <Badge key={idx} variant="outline">
              {platform}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="h-4 w-4" />
          <span className="font-bold">{film.revenue}</span> revenue generated
        </div>
      </CardFooter>
    </Card>
  );
};

export default FilmCard;
