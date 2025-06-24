import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Building, Calendar, Film } from 'lucide-react'
import { supabase, type Hall, type Showtime } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'
import HallForm from '@/components/HallForm'
import SeatLayout from '@/components/SeatLayout'
import { toast } from '@/hooks/use-toast'

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<Hall[]>([])
  const [showtimes, setShowtimes] = useState<Record<string, Showtime[]>>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHall, setEditingHall] = useState<Hall | null>(null)
  const [viewingLayout, setViewingLayout] = useState<string | null>(null)

  useEffect(() => {
    fetchHalls()
  }, [])

  const fetchHalls = async () => {
    try {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .order('hall_name')

      if (error) throw error
      
      const hallsData = data || []
      setHalls(hallsData)
      
      // Fetch showtimes for each hall
      if (hallsData.length > 0) {
        const showtimesData: Record<string, Showtime[]> = {}
        
        for (const hall of hallsData) {
          const { data: hallShowtimes } = await supabase
            .from('showtimes')
            .select(`
              *,
              movie:movies(title, duration, genre)
            `)
            .eq('hall_id', hall.hall_id)
            .gte('show_date', new Date().toISOString().split('T')[0])
            .order('show_date')
            .order('show_time')
          
          showtimesData[hall.hall_id] = hallShowtimes || []
        }
        
        setShowtimes(showtimesData)
      }
    } catch (error) {
      console.error('Error fetching halls:', error)
      toast({
        title: "Error",
        description: "Failed to load halls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHall = async (hallId: string) => {
    if (!confirm('Are you sure you want to delete this hall? This will also delete all related showtimes and bookings.')) {
      return
    }

    try {
      // Delete in order: bookings -> showtimes -> hall
      const { data: hallShowtimes } = await supabase
        .from('showtimes')
        .select('showtime_id')
        .eq('hall_id', hallId)

      if (hallShowtimes && hallShowtimes.length > 0) {
        const showtimeIds = hallShowtimes.map(st => st.showtime_id)
        
        // Delete bookings
        await supabase
          .from('bookings')
          .delete()
          .in('showtime_id', showtimeIds)
      }

      // Delete showtimes
      await supabase
        .from('showtimes')
        .delete()
        .eq('hall_id', hallId)

      // Delete the hall
      const { error } = await supabase
        .from('halls')
        .delete()
        .eq('hall_id', hallId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Hall deleted successfully",
      })
      
      fetchHalls()
    } catch (error) {
      console.error('Error deleting hall:', error)
      toast({
        title: "Error",
        description: "Failed to delete hall",
        variant: "destructive",
      })
    }
  }

  const handleEditHall = (hall: Hall) => {
    setEditingHall(hall)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingHall(null)
  }

  const getSeatLayout = (hall: Hall) => {
    try {
      return JSON.parse(hall.seat_layout)
    } catch {
      // Generate default layout if parsing fails
      const layout = []
      for (let row = 0; row < hall.layout_rows; row++) {
        const rowSeats = []
        for (let col = 0; col < hall.layout_columns; col++) {
          rowSeats.push({
            row: row + 1,
            column: col + 1,
            seat_number: `${String.fromCharCode(65 + row)}${col + 1}`,
            is_available: true,
            seat_type: 'regular'
          })
        }
        layout.push(rowSeats)
      }
      return layout
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Cinema Halls</h1>
            <p className="text-slate-400">Manage your cinema halls and seating arrangements</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Hall
          </button>
        </div>

        {halls.length === 0 ? (
          <div className="text-center py-20">
            <Building className="h-20 w-20 text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No halls found</h3>
            <p className="text-slate-400 text-lg mb-8">Create your first cinema hall to get started</p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Create First Hall
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {halls.map((hall) => (
              <div key={hall.hall_id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <Building className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{hall.hall_name}</h3>
                        <p className="text-sm text-slate-400">Hall ID: {hall.hall_id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditHall(hall)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHall(hall.hall_id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Total Seats</p>
                        <p className="text-white font-semibold text-lg">{hall.total_seats}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-slate-400 text-sm">Layout</p>
                        <p className="text-white font-semibold text-lg">{hall.layout_rows} × {hall.layout_columns}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-400 text-sm">Created</p>
                      <p className="text-white font-semibold">{new Date(hall.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Showtimes */}
                  {showtimes[hall.hall_id] && showtimes[hall.hall_id].length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <h4 className="text-sm font-medium text-white">Upcoming Shows</h4>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {showtimes[hall.hall_id].slice(0, 3).map((showtime) => (
                          <div key={showtime.showtime_id} className="bg-slate-700/30 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <Film className="h-3 w-3 text-blue-400" />
                              <span className="text-white text-sm font-medium">
                                {showtime.movie?.title || 'Unknown Movie'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              {new Date(showtime.show_date).toLocaleDateString()} at {showtime.show_time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setViewingLayout(viewingLayout === hall.hall_id ? null : hall.hall_id)}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      {viewingLayout === hall.hall_id ? 'Hide Layout' : 'View Layout'}
                    </button>
                  </div>
                </div>

                {/* Seat Layout Preview */}
                {viewingLayout === hall.hall_id && (
                  <div className="border-t border-slate-700 p-4">
                    <SeatLayout 
                      seats={getSeatLayout(hall)} 
                      readonly={true}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hall Form Modal */}
        <HallForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSuccess={fetchHalls}
          hallData={editingHall}
        />
      </div>
    </div>
  )
}