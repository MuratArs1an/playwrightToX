import { test, expect } from '@playwright/test';


const USER_NAME="xxxxxxxxx";
const PASSWORD="xxxxxxxxx";
const TEL_NO="xxxxxxxxx";
const MSG_ADDRESS="xxxxxxxxx";

test('has title', async ({ page }) => {
    await page.goto('https://twitter.com/?lang=tr');

    await expect(page).toHaveTitle('X. Olan biten burada / X');
});

test.describe('twitter login and message control', () => {

    test('log in', async({page})=>{
        await page.goto('https://twitter.com/?lang=tr');

        await page.getByText('Giriş yap').click();
        await page.getByLabel('Telefon numarası, e-posta').fill(USER_NAME);
        await page.getByRole('button', { name: 'İleri' }).click();
        
        await page.getByTestId('ocfEnterTextTextInput').fill(TEL_NO);
        await page.getByTestId('ocfEnterTextNextButton').click();

        //Kullanıcı adı girişinin başarılı olduğunun check ediyoruz
        await expect(page.getByLabel('E-posta')).toHaveValue(USER_NAME);
        await page.getByLabel('Şifre', { exact: true }).fill(PASSWORD);
        await page.getByTestId('LoginForm_Login_Button').click();
        await page.waitForTimeout(3000);

        //Loginin başarılı olup olmadığını kontrol ediyoruz
        await expect(page.getByRole('link', { name: 'xxxxxxxxx' })).toBeVisible();  

        //mesaj kutusuna gidiyoruz
        await page.getByTestId('AppTabBar_DirectMessage_Link').click(); 

        //DM deki mesaj sayısını kontrol ediyoruz
        //mesaj sayısı sıfırdan buyukse mesajı silme
        await page.waitForTimeout(3000);
        const messageCount=await page.getByTestId('cellInnerDiv').count();
        if(messageCount>2){
            await page.getByTestId('conversation').first().click();
            await page.getByLabel('Daha fazla').first().click();
            await page.getByRole('menuitem', { name: 'Sohbeti sil' }).click();
            await page.getByTestId('confirmationSheetConfirm').click();

            //mesaj kutusundaki mesaj sayısının düşmesini bekliyoruz
            await page.waitForTimeout(3000);
            const newMessageNum=await page.getByTestId('cellInnerDiv').count();
            expect(newMessageNum).toBeLessThan(messageCount)
        }


        //mesaj gönderme
        await page.getByRole('link', { name: 'Yeni mesaj' }).click();
        await expect(page.locator('#root-header').getByText('Mesajlar')).toBeVisible();
        await page.getByTestId('searchPeople').click();
        await page.getByTestId('searchPeople').fill(MSG_ADDRESS);

        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: '"xxxxxxxxx"' }).click();

        await page.getByTestId('nextButton').click();

        await page.getByTestId('dmComposerTextInput').locator('div').nth(2).click();
        await page.getByTestId('dmComposerTextInput').fill(messageCount.toString());
        await page.getByTestId('dmComposerSendButton').click();
    });
});