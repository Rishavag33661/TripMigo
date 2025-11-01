import { Card, CardContent, CardHeader } from './card'
import { Skeleton } from './skeleton'

// Hotel Card Skeleton
export function HotelCardSkeleton() {
    return (
        <Card className="flex-none w-80">
            <div className="aspect-video overflow-hidden rounded-t-lg">
                <Skeleton className="w-full h-full" />
            </div>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <div className="text-right">
                            <Skeleton className="h-5 w-20 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-6 w-16 rounded-full" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Multiple Hotel Cards Loading
export function HotelsLoadingSkeleton() {
    return (
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-6 pt-2 px-4">
            {[1, 2, 3, 4].map((i) => (
                <HotelCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Destination Card Skeleton
export function DestinationCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video">
                <Skeleton className="w-full h-full" />
            </div>
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
    )
}

// Travel Mode Skeleton
export function TravelModeCardSkeleton() {
    return (
        <Card className="cursor-pointer transition-all">
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Essential Item Skeleton
export function EssentialItemSkeleton() {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-lg border">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    )
}

// Itinerary Day Skeleton
export function ItineraryDaySkeleton() {
    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 p-3 border rounded-lg">
                            <Skeleton className="h-4 w-16" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-40 mb-2" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// Generic List Loading
export function ListLoadingSkeleton({
    count = 5,
    height = "h-16"
}: {
    count?: number
    height?: string
}) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className={`w-full ${height}`} />
            ))}
        </div>
    )
}

// Page Loading Skeleton
export function PageLoadingSkeleton() {
    return (
        <div className="space-y-6 p-6">
            <div className="text-center space-y-3">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-96 mx-auto" />
            </div>

            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}