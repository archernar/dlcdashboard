import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

public class DLCCrypt{
    public static String encrypt(String key, String initVector, String value) {
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

            byte[] encrypted = cipher.doFinal(value.getBytes());
            (new DLCUtil(false)).sysOut("encrypted string: " + Base64.encodeBase64String(encrypted));

            return Base64.encodeBase64String(encrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    public static String decrypt(String key, String initVector, String encrypted) {
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));
            (new DLCUtil(false)).sysOut( new String(original) );

            return new String(original);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

private static String cryDecode(String cry) {
     StringBuilder sb = new StringBuilder();
     String sz;
     int radix = 28;
     int o = 0;
     int k = 0;
     int kl = cry.length();
     sz = cry.substring(k, k+2);kl--;kl--;k++;k++;
     o = Integer.parseInt(sz,radix);
     // kl--;kl--;k++;k++;
     while (k<=cry.length()-2) {
          sz = cry.substring(k, k+2);
          int ii = Integer.parseInt(sz,radix) - o;
          char cc = (char) ii;
          sb.append(cc);
          k=k+2;
     }
     return(sb.toString());
}

}
