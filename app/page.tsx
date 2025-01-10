"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Activity,
  Brain,
  Heart,
  Moon,
  SmartphoneIcon,
  CircleIcon,
  WatchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useWhoop } from "@/hooks/use-whoop";
import { connected } from "node:process";

export default function Home() {
  const { isConnected, connect } = useWhoop();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-white p-8 mb-12 border">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-black">
              Secure Your Fitness Journey
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wearables, encrypt your data, and get personalized AI
              coaching - all secured by blockchain technology.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Sleep Analytics",
              icon: Moon,
              description: "Track your sleep cycles and recovery patterns",
              color: "from-indigo-500 to-purple-500",
            },
            {
              title: "Heart Health",
              icon: Heart,
              description: "Monitor heart rate variability and recovery",
              color: "from-red-500 to-pink-500",
            },
            {
              title: "Activity Tracking",
              icon: Activity,
              description: "Log workouts and track progress over time",
              color: "from-green-500 to-emerald-500",
            },
            {
              title: "AI Coaching",
              icon: Brain,
              description: "Get personalized advice from our AI coach",
              color: "from-blue-500 to-cyan-500",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white border-none shadow-sm"
            >
              <div className="p-6">
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Wearables Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Connect Your Wearables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Whoop",
                icon: WatchIcon,
                description: "Track recovery, strain, and sleep metrics",
                color: "bg-black",
                action: () => connect(),
                connected: isConnected,
              },
              {
                name: "Oura Ring",
                icon: CircleIcon,
                description: "Monitor sleep quality and readiness scores",
                color: "bg-gray-800",
                action: () => {},
                connected: false,
              },
              {
                name: "Fitbit",
                icon: SmartphoneIcon,
                description: "Track activity, exercise, and heart rate",
                color: "bg-blue-500",
                action: () => {},
                connected: false,
              },
            ].map((device) => (
              <Card key={device.name} className="border-none">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-lg ${device.color}`}>
                      <device.icon className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={device.action}
                      disabled={device.connected}
                    >
                      {device.connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{device.name}</h3>
                  <p className="text-gray-600">{device.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Link href="/dashboard">
            <Button className="bg-black text-white px-8 py-6 text-lg rounded-full hover:bg-gray-800 transition-colors">
              Start Your Journey Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
