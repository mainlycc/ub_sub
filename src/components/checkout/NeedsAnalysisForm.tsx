import React from 'react';
import { NeedsAnalysisData } from '@/types/insurance';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface NeedsAnalysisFormProps {
  data: NeedsAnalysisData;
  onChange: (data: NeedsAnalysisData) => void;
  errors?: { [key: string]: string };
}

export const NeedsAnalysisForm: React.FC<NeedsAnalysisFormProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const handleChange = (field: keyof NeedsAnalysisData) => {
    onChange({
      ...data,
      [field]: !data[field]
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Analiza Potrzeb Ubezpieczeniowych</h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="isInterestedInGapInsurance"
            checked={data.isInterestedInGapInsurance}
            onCheckedChange={() => handleChange('isInterestedInGapInsurance')}
          />
          <div className="space-y-1">
            <Label htmlFor="isInterestedInGapInsurance">
              Czy jesteś zainteresowany/a ubezpieczeniem GAP?
            </Label>
            <p className="text-sm text-gray-500">
              Ubezpieczenie GAP chroni przed utratą wartości pojazdu w przypadku szkody całkowitej
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="hasValidAcPolicy"
            checked={data.hasValidAcPolicy}
            onCheckedChange={() => handleChange('hasValidAcPolicy')}
          />
          <div className="space-y-1">
            <Label htmlFor="hasValidAcPolicy">
              Czy posiadasz aktualną polisę AC?
            </Label>
            <p className="text-sm text-gray-500">
              Ubezpieczenie GAP wymaga posiadania ważnej polisy AC
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="isVehiclePrivileged"
            checked={data.isVehiclePrivileged}
            onCheckedChange={() => handleChange('isVehiclePrivileged')}
          />
          <div className="space-y-1">
            <Label htmlFor="isVehiclePrivileged">
              Czy pojazd jest uprzywilejowany?
            </Label>
            <p className="text-sm text-gray-500">
              Np. pojazd służb ratowniczych, policji itp.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="isVehicleLeased"
            checked={data.isVehicleLeased}
            onCheckedChange={() => handleChange('isVehicleLeased')}
          />
          <div className="space-y-1">
            <Label htmlFor="isVehicleLeased">
              Czy pojazd jest w leasingu?
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="isVehicleFinanced"
            checked={data.isVehicleFinanced}
            onCheckedChange={() => handleChange('isVehicleFinanced')}
          />
          <div className="space-y-1">
            <Label htmlFor="isVehicleFinanced">
              Czy pojazd jest finansowany kredytem?
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="isVehicleUsedCommercially"
            checked={data.isVehicleUsedCommercially}
            onCheckedChange={() => handleChange('isVehicleUsedCommercially')}
          />
          <div className="space-y-1">
            <Label htmlFor="isVehicleUsedCommercially">
              Czy pojazd jest używany w celach zarobkowych?
            </Label>
            <p className="text-sm text-gray-500">
              Np. taxi, nauka jazdy, wynajem
            </p>
          </div>
        </div>
      </div>

      {Object.entries(errors).map(([key, error]) => (
        <p key={key} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      ))}
    </div>
  );
}; 