
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TableProperties } from "lucide-react";

interface AddResultsSidebarProps {
  onAddResult: (resultText: string) => void;
}

const modules = {
  "EDA": ["Univariate Analysis", "Bivariate Analysis", "Correlation Matrix", "Data Quality Report"],
  "Sample & Segmentation": ["Population Summary", "Segmentation Profile", "Sample Design"],
  "Model Estimation": ["Model Coefficients", "Goodness of Fit", "Variable Importance"],
  "Performance Testing": ["Lift Chart", "Gains Table", "KS Statistic"]
};

type Module = keyof typeof modules;

export function AddResultsSidebar({ onAddResult }: AddResultsSidebarProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);
  const [submodules, setSubmodules] = useState<string[]>([]);

  const handleModuleChange = (value: string) => {
    const module = value as Module;
    setSelectedModule(module);
    setSubmodules(modules[module] || []);
    setSelectedSubmodule(null);
  };

  const handleAddResult = () => {
    if (selectedModule && selectedSubmodule) {
      const resultText = `--- ${selectedModule}: ${selectedSubmodule} ---\n\n[Placeholder for ${selectedSubmodule} result]\n`;
      onAddResult(resultText);
    }
  };

  return (
    <Card className="h-full flex flex-col border-l rounded-none shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <TableProperties className="text-primary" />
          <span>Add Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="module-select">Module</Label>
          <Select onValueChange={handleModuleChange}>
            <SelectTrigger id="module-select">
              <SelectValue placeholder="Select a module..." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(modules).map((module) => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="submodule-select">Submodule</Label>
          <Select
            value={selectedSubmodule || ""}
            onValueChange={setSelectedSubmodule}
            disabled={!selectedModule}
          >
            <SelectTrigger id="submodule-select">
              <SelectValue placeholder="Select a submodule..." />
            </SelectTrigger>
            <SelectContent>
              {submodules.map((submodule) => (
                <SelectItem key={submodule} value={submodule}>{submodule}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="w-full"
          disabled={!selectedModule || !selectedSubmodule}
          onClick={handleAddResult}
        >
          Add to Document
        </Button>
      </CardContent>
    </Card>
  );
}
