import Link from "next/link"

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
            {job.title}
          </Link>
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{job.type}</span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600 font-medium">{job.company}</p>
        <p className="text-gray-500 text-sm">{job.location}</p>
        {job.salary && <p className="text-green-600 font-medium">{job.salary}</p>}
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs">{new Date(job.created_at).toLocaleDateString()}</span>
        <Link href={`/jobs/${job.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          View Details
        </Link>
      </div>
    </div>
  )
}
