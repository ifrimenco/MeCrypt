using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MeCrypt.Common
{
    // TODO - de modificat din BigInteger in Base64 
    public static class SecretsHelper
    {
        // curently works up to max 255 shares
        public static List<BigInteger> GenerateShares(BigInteger secret, int numberOfShares, int sharesThreshold)
        {
            List<BigInteger> polynomial = new List<BigInteger>();
            List<BigInteger> result = new List<BigInteger>();

            polynomial.Add(secret);

            for (int i = 1; i < sharesThreshold; i++)
            {
                BigInteger root = 0;
                while (root == 0)
                {
                    RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();
                    var numberAsByteArray = new byte[2];
                    provider.GetBytes(numberAsByteArray);
                    root = new BigInteger(numberAsByteArray);
                    root = root % 7159;
                }

                polynomial.Add(root);
            }

            for (int i = 1; i <= numberOfShares; i++)
            {
                BigInteger x = i;
                BigInteger y = ComputeY(x, polynomial);
                result.Add(GetShare(x, y));
            }

            return result;
        }

        public static BigInteger GenerateSecret(List<BigInteger> shares)
        {
            var pointsArray = shares.Select(share => GetPoint(share)).ToArray();

            Fraction result = new Fraction(0, 1);

            for (int i = 0; i < pointsArray.Length; i++)
            {
                Fraction lagrange = new Fraction(pointsArray[i].Item2, 1);
                for (int j = 0; j < pointsArray.Length; j++)
                {
                    if (i != j)
                    {
                        Fraction operand = new Fraction(-pointsArray[j].Item1, pointsArray[i].Item1 - pointsArray[j].Item1);
                        lagrange = lagrange * operand;
                    }
                }
                result = result + lagrange;
            }

            return result.Numerator;
        }
        private static BigInteger GetShare(BigInteger x, BigInteger y)
        {
            var xByte = x.ToByteArray();
            var yByte = y.ToByteArray();

            byte[] resultByte = new byte[xByte.Length + yByte.Length];
            Array.Copy(xByte, resultByte, xByte.Length);
            Array.Copy(yByte, 0, resultByte, 1, yByte.Length);

            var share = new BigInteger(resultByte);

            return share;
        }

        private static Tuple<BigInteger, BigInteger> GetPoint(BigInteger share)
        {
            var shareByte = share.ToByteArray();
            var xByte = new byte[1];
            var yByte = new byte[shareByte.Length - 1];

            Array.Copy(shareByte, 0, xByte, 0, 1);
            Array.Copy(shareByte, 1, yByte, 0, shareByte.Length - 1);

            var result = new Tuple<BigInteger, BigInteger>(new BigInteger(xByte), new BigInteger(yByte));

            return result;
        }
        private static BigInteger ComputeY(BigInteger x, List<BigInteger> polynomial)
        {
            BigInteger y = 0;
            BigInteger xPowered = 1;
            foreach (var coef in polynomial)
            {
                y = y + (coef * xPowered);
                xPowered = xPowered * x;
            }

            return y;
        }
    }
    public class Fraction
    {
        public BigInteger Numerator { get; set; }
        public BigInteger Denominator { get; set; }

        public Fraction(BigInteger numerator, BigInteger denominator)
        {
            Numerator = numerator;
            Denominator = denominator;
        }

        public void Reduce()
        {
            var gcd = BigInteger.GreatestCommonDivisor(Numerator, Denominator);

            Numerator = Numerator / gcd;
            Denominator = Denominator / gcd;
            
            if (Denominator < 0 && Numerator > 0)
            {
                Denominator = -Denominator;
                Numerator = -Numerator;
            }
        }

        public static Fraction operator *(Fraction first, Fraction second)
        {
            Fraction result = new Fraction(first.Numerator * second.Numerator, first.Denominator * second.Denominator);
            result.Reduce();

            return result;
        }

        public static Fraction operator +(Fraction first, Fraction second)
        {
            Fraction result = new Fraction(first.Numerator * second.Denominator + first.Denominator * second.Numerator, first.Denominator * second.Denominator);
            result.Reduce();

            return result;
        }


    }

}
