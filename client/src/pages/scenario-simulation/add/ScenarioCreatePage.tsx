import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Zap } from 'lucide-react';
import { useCreateScenarioMutation } from '../../../redux/apis/scenario.api';

const scenarioSchema = z.object({
  name: z.string().min(1, 'Scenario name is required'),
  description: z.string().min(1, 'Description is required'),
  tariffRate: z.number().min(0, 'Tariff rate must be positive'),
  demandCharges: z.number().min(0, 'Demand charges must be positive'),
  fixedCharges: z.number().min(0, 'Fixed charges must be positive'),
  fuelSurcharge: z.number().min(0, 'Fuel surcharge must be positive'),
  supplierType: z.enum(['grid', 'renewable', 'hybrid']),
  energyMix: z.object({
    solar: z.number().min(0).max(100),
    wind: z.number().min(0).max(100),
    grid: z.number().min(0).max(100),
  }),
});

type ScenarioFormData = z.infer<typeof scenarioSchema>;

const ScenarioCreatePage = () => {
  const navigate = useNavigate();
  const [createScenario, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateScenarioMutation();
  const [selectedBill, setSelectedBill] = useState<string>('');
  console.log("setSelectedBill", setSelectedBill);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ScenarioFormData>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      tariffRate: 5.50,
      demandCharges: 200,
      fixedCharges: 150,
      fuelSurcharge: 0.75,
      supplierType: 'grid',
      energyMix: {
        solar: 30,
        wind: 20,
        grid: 50,
      },
    },
  });

  const energyMix = watch('energyMix');


  useEffect(() => {
    if (isCreateSuccess) {
      toast.success('Scenario created successfully');
      navigate('/admin/scenario-simulation/table');
    }
  }, [isCreateSuccess, navigate]);

  useEffect(() => {
    if (isCreateError) {
      toast.error('Failed to create scenario');
    }
  }, [isCreateError]);

  const onSubmit = async (data: ScenarioFormData) => {
    try {
      await createScenario({
        ...data,
        billId: selectedBill,
      } as any).unwrap();
    } catch (err) {
      console.error('Scenario creation failed:', err);
    }
  };

  const totalEnergyMix = energyMix.solar + energyMix.wind + energyMix.grid;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Scenario Simulation Engine</h1>
          <p className="text-muted-foreground">
            Create "what-if" scenarios to compare tariff changes, alternative supplier pricing, and energy mix variations
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Scenario Information
              </CardTitle>
              <CardDescription>
                Define the basic parameters for your simulation scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Solar + Grid Mix Scenario"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierType">Supplier Type</Label>
                  <Select onValueChange={(value) => setValue('supplierType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid Only</SelectItem>
                      <SelectItem value="renewable">Renewable Only</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Grid + Renewable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe the scenario assumptions and goals..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tariff Parameters
              </CardTitle>
              <CardDescription>
                Configure the pricing structure for this scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tariffRate">Tariff Rate (₹/kWh)</Label>
                  <Input
                    id="tariffRate"
                    type="number"
                    step="0.01"
                    {...register('tariffRate', { valueAsNumber: true })}
                  />
                  {errors.tariffRate && (
                    <p className="text-sm text-red-600">{errors.tariffRate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandCharges">Demand Charges (₹/kW)</Label>
                  <Input
                    id="demandCharges"
                    type="number"
                    step="0.01"
                    {...register('demandCharges', { valueAsNumber: true })}
                  />
                  {errors.demandCharges && (
                    <p className="text-sm text-red-600">{errors.demandCharges.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedCharges">Fixed Charges (₹/month)</Label>
                  <Input
                    id="fixedCharges"
                    type="number"
                    step="0.01"
                    {...register('fixedCharges', { valueAsNumber: true })}
                  />
                  {errors.fixedCharges && (
                    <p className="text-sm text-red-600">{errors.fixedCharges.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelSurcharge">Fuel Surcharge (₹/kWh)</Label>
                  <Input
                    id="fuelSurcharge"
                    type="number"
                    step="0.01"
                    {...register('fuelSurcharge', { valueAsNumber: true })}
                  />
                  {errors.fuelSurcharge && (
                    <p className="text-sm text-red-600">{errors.fuelSurcharge.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Mix Configuration
              </CardTitle>
              <CardDescription>
                Define the energy source composition for this scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="solar">Solar (%)</Label>
                  <Input
                    id="solar"
                    type="number"
                    min="0"
                    max="100"
                    {...register('energyMix.solar', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wind">Wind (%)</Label>
                  <Input
                    id="wind"
                    type="number"
                    min="0"
                    max="100"
                    {...register('energyMix.wind', { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grid">Grid (%)</Label>
                  <Input
                    id="grid"
                    type="number"
                    min="0"
                    max="100"
                    {...register('energyMix.grid', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Total Energy Mix: {totalEnergyMix}%</strong>
                  {totalEnergyMix !== 100 && (
                    <span className="text-orange-600 ml-2">
                      (Should total 100%)
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>


          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isCreating || totalEnergyMix !== 100}
              className="flex-1"
            >
              {isCreating ? 'Creating Scenario...' : 'Create & Run Simulation'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/scenario-simulation/table')}
            >
              Cancel
            </Button>
          </div>
        </form>


        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-medium">Simulation Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Compare different tariff structures and pricing models</li>
                <li>• Analyze impact of renewable energy integration</li>
                <li>• Calculate potential cost savings and ROI</li>
                <li>• Generate detailed comparison reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioCreatePage;