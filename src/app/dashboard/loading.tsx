export default function DashboardLoading() {
    return (
        <div className="flex-1 flex flex-col pt-8 space-y-8 animate-pulse">

            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-4">
                    <div className="h-8 w-64 bg-white/10 rounded-lg"></div>
                    <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
                </div>
                <div className="h-10 w-full md:w-80 bg-white/10 rounded-lg"></div>
            </div>

            {/* Content Area Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
            </div>

            <div className="h-[400px] w-full bg-white/5 rounded-xl border border-white/5 mt-8"></div>

        </div>
    );
}
