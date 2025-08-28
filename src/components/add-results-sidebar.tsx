
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TableProperties, BarChart, Table as TableIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";

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

type ResultItem = {
    id: string;
    name: string;
}

// Mock data for charts and tables
const resultsData: Record<string, Record<string, { charts: ResultItem[], tables: ResultItem[] }>> = {
  "Univariate Analysis": {
    charts: [
      { id: "uni_chart_1", name: "Age Distribution Histogram" },
      { id: "uni_chart_2", name: "Income Box Plot" },
    ],
    tables: [
      { id: "uni_table_1", name: "Descriptive Statistics" },
    ],
  },
  "Correlation Matrix": {
    charts: [
        { id: "corr_chart_1", name: "Correlation Heatmap" },
    ],
    tables: [
        { id: "corr_table_1", name: "Correlation Coefficients" },
    ],
  },
  // Add more mock data for other submodules as needed...
};


export function AddResultsSidebar({ onAddResult }: AddResultsSidebarProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);
  const [submodules, setSubmodules] = useState<string[]>([]);
  const [availableResults, setAvailableResults] = useState<{ charts: ResultItem[], tables: ResultItem[] } | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, ResultItem>>({});

  const handleModuleChange = (value: string) => {
    const module = value as Module;
    setSelectedModule(module);
    setSubmodules(modules[module] || []);
    setSelectedSubmodule(null);
    setAvailableResults(null);
    setSelectedItems({});
  };

  const handleSubmoduleChange = (value: string) => {
    setSelectedSubmodule(value);
    setAvailableResults(resultsData[value] || { charts: [], tables: [] });
    setSelectedItems({});
  };

  const handleItemSelection = (item: ResultItem, type: 'chart' | 'table') => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
    } else {
        newSelectedItems[item.id] = { ...item, type };
    }
    setSelectedItems(newSelectedItems);
  };

  const handleAddResult = () => {
    const itemsToAdd = Object.values(selectedItems);
    if (itemsToAdd.length > 0) {
      const resultText = itemsToAdd.map(item => 
        `--- ${selectedModule}: ${selectedSubmodule} ---\n\n[Placeholder for ${item.name}]\n`
      ).join('\n');
      onAddResult(resultText);
    }
  };

  const renderResultList = (items: ResultItem[], type: 'chart' | 'table') => (
    <div className="space-y-2">
      {items.length > 0 ? items.map(item => (
        <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
          <Checkbox 
            id={item.id} 
            checked={!!selectedItems[item.id]} 
            onCheckedChange={() => handleItemSelection(item, type)}
          />
          <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.name}</Label>
        </div>
      )) : (
        <p className="text-sm text-muted-foreground text-center p-4">No {type}s available.</p>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col border-l rounded-none shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <TableProperties className="text-primary" />
          <span>Add Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto space-y-4">
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
            onValueChange={handleSubmoduleChange}
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
        
        {availableResults && <Separator />}

        {availableResults && (
            <Tabs defaultValue="charts" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts"><BarChart className="mr-2" />Charts</TabsTrigger>
                <TabsTrigger value="tables"><TableIcon className="mr-2" />Tables</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-1 mt-2 -mx-4">
                <div className="px-4">
                    <TabsContent value="charts">
                       {renderResultList(availableResults.charts, 'chart')}
                    </TabsContent>
                    <TabsContent value="tables">
                       {renderResultList(availableResults.tables, 'table')}
                    </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
        )}
      </CardContent>

      <div className="p-4 border-t">
         <Button 
            className="w-full"
            disabled={Object.keys(selectedItems).length === 0}
            onClick={handleAddResult}
          >
            Add {Object.keys(selectedItems).length > 0 ? `(${Object.keys(selectedItems).length})` : ''} to Document
          </Button>
      </div>
    </Card>
  );
}
