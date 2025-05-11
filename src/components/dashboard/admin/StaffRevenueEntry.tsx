
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BulkRevenueUpload } from "./BulkRevenueUpload";

interface Film {
  id: string;
  title: string;
  user_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    tier?: 'basic' | 'premium' | 'elite';
  };
}

interface RevenueEntry {
  id: string;
  film_id: string;
  platform: string;
  amount: number;
  payment_date: string;
  payment_period_start?: string;
  payment_period_end?: string;
  views?: number;
  transaction_id?: string;
  status: string;
  entered_at: string;
  entered_by?: string;
}

export const StaffRevenueEntry = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<string>('');
  const [entries, setEntries] = useState<RevenueEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    platform: '',
    amount: '',
    paymentDate: '',
    periodStart: '',
    periodEnd: '',
    views: '',
    transactionId: '',
    notes: ''
  });

  const platforms = [
    'YouTube', 'Netflix', 'Amazon Prime', 'Hulu', 
    'Apple TV+', 'Vimeo', 'Tubi', 'Pluto TV', 'HBO Max',
    'Dailymotion', 'Disney+', 'Paramount+'
  ];

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    if (selectedFilm) {
      fetchRecentEntries();
    }
  }, [selectedFilm]);

  const fetchFilms = async () => {
    try {
      const { data, error } = await supabase
        .from('films')
        .select('id, title, user_id, profiles:user_id(first_name, last_name, tier)')
        .order('title');
      
      if (error) throw error;
      setFilms(data || []);
    } catch (error) {
      console.error('Error fetching films:', error);
      toast({
        title: "Error",
        description: "Failed to load films. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchRecentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_earnings')
        .select('*')
        .eq('film_id', selectedFilm)
        .order('payment_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load recent entries. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('platform_earnings')
        .insert({
          film_id: selectedFilm,
          platform: newEntry.platform,
          amount: parseFloat(newEntry.amount),
          payment_date: newEntry.paymentDate,
          payment_period_start: newEntry.periodStart || null,
          payment_period_end: newEntry.periodEnd || null,
          views: parseInt(newEntry.views) || null,
          transaction_id: newEntry.transactionId || null,
          notes: newEntry.notes || null,
          status: 'paid',
          currency: 'USD'
        });

      if (error) throw error;

      // Reset form
      setNewEntry({
        platform: '',
        amount: '',
        paymentDate: '',
        periodStart: '',
        periodEnd: '',
        views: '',
        transactionId: '',
        notes: ''
      });

      // Refresh entries
      fetchRecentEntries();
      
      toast({
        title: "Success",
        description: "Revenue entry added successfully.",
      });
    } catch (error: any) {
      console.error('Error adding entry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilmDisplayName = (film: Film) => {
    const firstName = film.profiles?.first_name || '';
    const lastName = film.profiles?.last_name || '';
    const tier = film.profiles?.tier || 'basic';
    const filmmaker = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
    
    return `${film.title} (${filmmaker}) - ${tier}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Revenue Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEntrySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="film">Film</Label>
                <Select
                  value={selectedFilm}
                  onValueChange={setSelectedFilm}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a film" />
                  </SelectTrigger>
                  <SelectContent>
                    {films.map(film => (
                      <SelectItem key={film.id} value={film.id}>
                        {getFilmDisplayName(film)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newEntry.platform}
                  onValueChange={(value) => setNewEntry({...newEntry, platform: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="views">Views</Label>
                  <Input
                    id="views"
                    type="number"
                    value={newEntry.views}
                    onChange={(e) => setNewEntry({...newEntry, views: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={newEntry.paymentDate}
                  onChange={(e) => setNewEntry({...newEntry, paymentDate: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodStart">Period Start</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={newEntry.periodStart}
                    onChange={(e) => setNewEntry({...newEntry, periodStart: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">Period End</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={newEntry.periodEnd}
                    onChange={(e) => setNewEntry({...newEntry, periodEnd: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  type="text"
                  value={newEntry.transactionId}
                  onChange={(e) => setNewEntry({...newEntry, transactionId: e.target.value})}
                  placeholder="Platform's transaction reference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="Additional information about this revenue entry"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedFilm || !newEntry.platform || !newEntry.amount || !newEntry.paymentDate || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Revenue Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFilm ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {entries.length > 0 ? (
                  entries.map(entry => (
                    <div key={entry.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{entry.platform}</div>
                          <div className="text-sm text-muted-foreground">
                            ${entry.amount.toFixed(2)} • {entry.views || 0} views
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.payment_date).toLocaleDateString()}
                            {entry.payment_period_start && entry.payment_period_end && 
                              ` (${new Date(entry.payment_period_start).toLocaleDateString()} - ${new Date(entry.payment_period_end).toLocaleDateString()})`}
                          </div>
                          {entry.notes && (
                            <div className="text-xs italic mt-1 text-muted-foreground">{entry.notes}</div>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No entries yet for this film
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a film to view recent entries
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Entry Option */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkRevenueUpload onEntriesUploaded={fetchRecentEntries} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffRevenueEntry;
