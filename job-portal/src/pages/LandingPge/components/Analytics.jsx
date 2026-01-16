import React from "react";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";
import colorMapper from "../../../constant/colors/colorMapper";
const Analytics = () => {
  const stats = [
    {
      icon: Users,
      title: "Active Users",
      value: "30+",
      growth: "+15%",
      color: "blue",
    },
    {
      icon: Briefcase,
      title: "Jobs Posted",
      value: "10K+",
      growth: "+34%",
      color: "purple",
    },
    {
      icon: Target,
      title: "Successful Hires",
      value: "8K+",
      growth: "+8%",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: "Match Rate",
      value: "5%",
      growth: "3%",
      color: "orange_deep",
    },
  ];
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl  font-bold text-gray-900 mb-6">
            Platform
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 bg-clip-text text-transparent">
              Analytics
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights and data-driven result that showcase the power of
            our platform in connecting talent with opportunities.
          </p>
        </motion.div>
        {/* Stats section  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const styles = colorMapper[stat.color] || colorMapper.blue;
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${styles.icon}`} />
                  </div>
                  <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-md">
                    {stat.growth}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
