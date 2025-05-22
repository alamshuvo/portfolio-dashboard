"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllMeta } from "@/service/metaDataService";

import { Skeleton } from "@/ui/skeleton";
import { Shield, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

const AdminPage = () => {
  interface MetaData {
    projectsCount?: number;
    patientCount?: number;
    experienceCount?: number;
    blogsCount?: number;
    courseCount?: number;
  }

  const [meta, setMeta] = useState<MetaData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      const data = await getAllMeta();
      if (data) setMeta(data);
      setLoading(false);
    };

    fetchMeta();
  }, []);
  console.log(meta);
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Total Projects",
            icon: <Users className="h-4 w-4 text-gray-500" />,
            value: meta?.projectsCount,
          },
          {
            title: "Total Skills",
            icon: <Shield className="h-4 w-4 text-gray-500" />,
            value: meta?.patientCount,
          },
          {
            title: "Total Blogs",
            icon: <Shield className="h-4 w-4 text-gray-500" />,
            value: meta?.blogsCount,
          },
          {
            title: "Total Course",
            icon: <Shield className="h-4 w-4 text-gray-500" />,
            value: meta?.courseCount,
          },
          {
            title: "Experience Count",
            icon: <Star className="h-4 w-4 text-gray-500" />,
            value: meta?.experienceCount,
          },
        ].map((stat, i) => (
          <Card key={i} className="hover:bg-blue-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24 bg-blue-400" />
              ) : (
                <div className="text-2xl font-bold">{stat.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
