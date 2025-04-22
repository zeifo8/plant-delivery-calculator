import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PlantDeliveryCalculator() {
  const [inputs, setInputs] = useState({
    plantName: "",
    potA: "",
    potB: "",
    plantPerPot: "",
    wholesalePrice: "",
    representativePercent: "",
    numShelves: ""
  });

  const [result, setResult] = useState(null);
  const deliveryCost = 30000; // руб
  const baseLength = 300; // см
  const baseWidth = 400; // см

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    const potA = parseFloat(inputs.potA);
    const potB = parseFloat(inputs.potB);
    const plantPerPot = parseInt(inputs.plantPerPot);
    const wholesalePrice = parseFloat(inputs.wholesalePrice);
    const representativePercent = parseFloat(inputs.representativePercent);
    const numShelves = parseInt(inputs.numShelves);

    if (
      [potA, potB, plantPerPot, wholesalePrice, representativePercent, numShelves].some(
        (v) => isNaN(v) || v <= 0
      )
    ) {
      alert("Пожалуйста, заполните все числовые поля корректными значениями.");
      return;
    }

    // расчёт вместимости (с делением кассет пополам при необходимости)
    const countLength = Math.floor(baseLength / potA) + (Math.floor(baseLength / (potA / 2)) % 2);
    const countWidth = Math.floor(baseWidth / potB) + (Math.floor(baseWidth / (potB / 2)) % 2);
    const potsPerLayer = countLength * countWidth;
    const totalPotsFit = potsPerLayer * numShelves;
    const quantityTotal = totalPotsFit * plantPerPot;

    // финансовые расчеты
    const totalRevenue = wholesalePrice * quantityTotal;
    const representativeFee = (totalRevenue * representativePercent) / 100;
    const totalCost = totalRevenue + deliveryCost + representativeFee; // логика пользователя
    const minPricePerPlant = totalCost / quantityTotal;

    setResult({
      potsPerLayer,
      totalPotsFit,
      quantityTotal,
      totalRevenue,
      representativeFee,
      totalCost,
      minPricePerPlant
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center py-10 px-4">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold mb-6 text-emerald-700 text-center">
        Калькулятор выгоды доставки растений
      </motion.h1>

      <Card className="max-w-3xl w-full shadow-lg">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plant name */}
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1" htmlFor="plantName">Название растения</label>
            <input id="plantName" name="plantName" type="text" value={inputs.plantName} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" placeholder="Напр. Барбарис" />
          </div>

          {/* Pot dimensions */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="potA">Длина кассеты (a, см)</label>
            <input id="potA" name="potA" type="number" value={inputs.potA} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="potB">Ширина кассеты (b, см)</label>
            <input id="potB" name="potB" type="number" value={inputs.potB} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>

          {/* plants per pot */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="plantPerPot">Растений в кассете</label>
            <input id="plantPerPot" name="plantPerPot" type="number" value={inputs.plantPerPot} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>

          {/* Wholesale price */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="wholesalePrice">Оптовая цена (руб)</label>
            <input id="wholesalePrice" name="wholesalePrice" type="number" step="0.01" value={inputs.wholesalePrice} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>

          {/* Representative percent */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="representativePercent">Процент представителя (%)</label>
            <input id="representativePercent" name="representativePercent" type="number" step="0.01" value={inputs.representativePercent} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>

          {/* shelves */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="numShelves">Кол-во стеллажей</label>
            <input id="numShelves" name="numShelves" type="number" value={inputs.numShelves} onChange={handleChange} className="w-full rounded-xl border border-gray-300 p-2" />
          </div>

          {/* calculate button */}
          <div className="col-span-full flex justify-center mt-4">
            <Button size="lg" onClick={calculate}>Рассчитать</Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl w-full mt-8">
          <Card className="shadow-xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-emerald-700">Итоги для "{inputs.plantName || 'Растение'}"</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p><span className="font-medium">Кассет на ярус:</span> {result.potsPerLayer}</p>
                  <p><span className="font-medium">Всего кассет:</span> {result.totalPotsFit}</p>
                  <p><span className="font-medium">Всего растений:</span> {result.quantityTotal.toLocaleString('ru-RU')} шт</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-medium">Выручка (опт):</span> {result.totalRevenue.toLocaleString('ru-RU', {style:'currency', currency:'RUB'})}</p>
                  <p><span className="font-medium">Комиссия представителя:</span> {result.representativeFee.toLocaleString('ru-RU', {style:'currency', currency:'RUB'})}</p>
                  <p><span className="font-medium">Доставка:</span> {deliveryCost.toLocaleString('ru-RU', {style:'currency', currency:'RUB'})}</p>
                  <p><span className="font-medium">Итого затрат + опт:</span> {result.totalCost.toLocaleString('ru-RU', {style:'currency', currency:'RUB'})}</p>
                </div>
              </div>
              <hr className="my-2" />
              <p className="text-lg font-semibold">Полная цена за растение: <span className="text-emerald-600">{result.minPricePerPlant.toFixed(2)} руб</span></p>
              <p className="text-xs text-gray-500">(Включает оптовую стоимость, доставку и комиссию представителя)</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
