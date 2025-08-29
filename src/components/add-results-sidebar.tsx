
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TableProperties, BarChart, Table as TableIcon, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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

type ChartItem = {
    id: string;
    name: string;
    type: 'chart';
    imageUrl: string;
}

type TableItem = {
    id: string;
    name: string;
    type: 'table';
    data: {
        headers: string[];
        rows: (string | number)[][];
    }
}

type ResultItem = ChartItem | TableItem;

// Mock data for charts and tables
const resultsData: Record<string, { charts: ChartItem[], tables: TableItem[] }> = {
  "Univariate Analysis": {
    charts: [
      { id: "uni_chart_1", name: "Age Distribution Histogram", type: 'chart', imageUrl: "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/image.png" },
      { id: "uni_chart_2", name: "Income Box Plot", type: 'chart', imageUrl: "https://raw.githubusercontent.com/kannnan1/NIMBUS_Demo/main/box.png" },
    ],
    tables: [
      { 
        id: "uni_table_1", 
        name: "Descriptive Statistics", 
        type: 'table',
        data: {
            headers: ["Statistic", "Value"],
            rows: [
                ["Mean Age", 35.4],
                ["Median Income", "S$65,000"],
                ["Std Dev Age", 8.2],
                ["Sample Size", 1024],
            ]
        }
      },
    ],
  },
  "Correlation Matrix": {
    charts: [
        { id: "corr_chart_1", name: "Correlation Heatmap", type: 'chart', imageUrl: "https://picsum.photos/400/300?random=3" },
    ],
    tables: [
        { 
            id: "corr_table_1", 
            name: "Correlation Coefficients",
            type: 'table',
            data: {
                headers: ["Variable 1", "Variable 2", "Coefficient"],
                rows: [
                    ["Age", "Income", 0.45],
                    ["Age", "Spending", 0.21],
                    ["Income", "Spending", 0.88],
                ]
            }
        },
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

  const handleItemSelection = (item: ResultItem) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
    } else {
        newSelectedItems[item.id] = item;
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

  const renderResultList = (items: ResultItem[]) => (
    <div className="space-y-2">
      {items.length > 0 ? items.map(item => (
        <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
          <Checkbox 
            id={item.id} 
            checked={!!selectedItems[item.id]} 
            onCheckedChange={() => handleItemSelection(item)}
          />
          <Label htmlFor={item.id} className="flex-1 cursor-pointer">{item.name}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6"><Info className="w-4 h-4 text-muted-foreground" /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="p-2">
                <p className="font-semibold text-center mb-2">{item.name}</p>
                {item.type === 'chart' ? (
                  <Image src={item.imageUrl} alt={item.name} width={400} height={300} className="rounded-md" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {item.data.headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.data.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )) : (
        <p className="text-sm text-muted-foreground text-center p-4">No results available.</p>
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
                       {renderResultList(availableResults.charts)}
                    </TabsContent>
                    <TabsContent value="tables">
                       {renderResultList(availableResults.tables)}
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
