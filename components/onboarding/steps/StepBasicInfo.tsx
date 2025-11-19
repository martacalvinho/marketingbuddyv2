import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function StepBasicInfo({ formData, updateFormData }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Confirm the details</h2>
        <p className="text-slate-400">Our AI found this. Tweak it if needed.</p>
      </div>

      <div className="space-y-5 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
        <div>
          <Label className="text-slate-300">Product Name</Label>
          <Input 
            className="bg-slate-950 border-slate-800 text-white h-12 mt-1.5 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            placeholder="e.g. Marketing Buddy"
            value={formData.productName}
            onChange={(e) => updateFormData('productName', e.target.value)}
          />
        </div>

        <div>
          <Label className="text-slate-300">One-Sentence Value Prop</Label>
          <Textarea 
             className="bg-slate-950 border-slate-800 text-white min-h-[100px] mt-1.5 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none leading-relaxed"
            placeholder="Who is it for and what problem does it solve?"
            value={formData.valueProp}
            onChange={(e) => updateFormData('valueProp', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}